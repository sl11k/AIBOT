export async function sendChatMessage(
  message: string,
  onChunk: (text: string) => void
): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.slice(0, 500) }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    let fullResponse = data.answer || "";

    // Append sources if available
    if (data.sources && Array.isArray(data.sources) && data.sources.length > 0) {
      // Clean up the response if it already has a "Sources" section
      // The AI model sometimes adds its own sources, we want to unify them.
      // Remove any existing "Sources:" block at the end
      fullResponse = fullResponse.replace(/(?:\n\s*)*\*\*?Sources:?\*\*?[\s\S]*$/, '').trim();
      fullResponse = fullResponse.replace(/(?:\n\s*)*Sources:?[\s\S]*$/, '').trim();
      fullResponse = fullResponse.replace(/(?:\n\s*)*المصادر:?[\s\S]*$/, '').trim();

      fullResponse += "\n\n**المصادر:**\n";
      
      data.sources.forEach((source: string, index: number) => {
        // Filter out generic domains like youtube.com or wikipedia if possible, or keep them but label better
        // For now, let's keep them but format nicely.

        let label = source;
        try {
          const urlObj = new URL(source);
          let hostname = urlObj.hostname.replace(/^www\./, '');
          const path = urlObj.pathname;
          
          // Custom labels for known domains
          if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) label = 'YouTube Video';
          else if (hostname.includes('wikipedia.org')) label = 'Wikipedia';
          else if (hostname.includes('mayoclinic.org')) label = 'Mayo Clinic';
          else if (hostname.includes('healthline.com')) label = 'Healthline';
          else if (hostname.includes('webteb.com')) label = 'WebTeb (ويب طب)';
          else if (hostname.includes('who.int')) label = 'World Health Organization (WHO)';
          else if (hostname.includes('nih.gov')) label = 'National Institutes of Health (NIH)';
          else if (hostname.includes('cdc.gov')) label = 'CDC';
          else label = hostname; // Default to hostname
          
          // If it's a PDF, add [PDF]
          if (path.endsWith('.pdf')) {
            label += " [PDF]";
          }
        } catch {
          // invalid url
        }
        
        // Format: 1. [Label] (URL)
        fullResponse += `${index + 1}. [${label}](${source})\n`;
      });
    }

    // Since we are not streaming from backend anymore, we just emit the full response once.
    // If you want a typing effect, you could simulate it here, but instant is better for research results.
    onChunk(fullResponse);

    return fullResponse;

  } catch (error: any) {
    console.error("API Error:", error);
    throw error;
  }
}
