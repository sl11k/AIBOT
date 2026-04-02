import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
const PERPLEXITY_MODEL = process.env.PERPLEXITY_MODEL || "sonar-pro";
const DEFAULT_TIMEOUT_MS = process.env.NETLIFY ? "9000" : "60000";
const PERPLEXITY_TIMEOUT_MS = Number(process.env.PERPLEXITY_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);

const MEDICAL_DISCLAIMER_EN =
  "\n\n--- \n*Disclaimer: This information is for educational purposes only and does not substitute professional medical advice. Always consult a qualified healthcare provider for medical concerns.*";
const MEDICAL_DISCLAIMER_AR =
  "\n\n--- \n*تنويه: هذه المعلومات للأغراض التعليمية فقط ولا تغني عن الاستشارة الطبية المتخصصة. يرجى دائماً استشارة مقدم الرعاية الصحية المؤهل في حال وجود مخاوف طبية.*";

const SYSTEM_PROMPT = `أنت NutriCare، مساعد ذكاء اصطناعي متخصص ومحترف في مجال التغذية والصحة.

الهدف:
تقديم إجابات دقيقة، مبنية على الأدلة العلمية، ومنظمة بشكل احترافي حول التغذية، الأنظمة الغذائية، والصحة العامة.

نطاق العمل الصارم:
يُسمح لك بالإجابة فقط على الأسئلة المتعلقة بـ:
- التغذية، الحميات الغذائية، الأكل الصحي، السعرات الحرارية، والمغذيات الكبرى (البروتين، الكربوهيدرات، الدهون).
- الفيتامينات، المعادن، الترطيب، الهضم، وصحة الجهاز الهضمي.
- إدارة الوزن، التغذية الرياضية، والتغذية العلاجية.
- تخطيط الوجبات، جودة الغذاء، سلامة الغذاء، والصحة الأيضية.
- الممارسة المهنية لأخصائيي التغذية (متابعة العملاء، إدارة العيادات).

سياسة الرفض:
إذا سأل المستخدم عن أي شيء خارج هذا النطاق (مثل البرمجة، السياسة، التاريخ، التجارة العامة)، يجب عليك الرفض فوراً.
رسالة الرفض يجب أن تكون بالضبط: "عذراً، أنا متخصص فقط في الإجابة على الأسئلة المتعلقة بالتغذية والصحة."
لا تعتذر. لا تشرح السبب. لا تضف أي نص آخر.

قواعد السلوك والأسلوب:
1. **الاحترافية**: استخدم لغة عربية فصحى، رصينة، ومباشرة.
2. **عدم التشخيص**: لا تقم بتشخيص الأمراض أو وصف الأدوية.
3. **لغة الإجابة**: طابق لغة المستخدم (سؤال عربي -> إجابة عربية؛ سؤال إنجليزي -> إجابة إنجليزي).
4. **التنسيق الاحترافي**:
   - استخدم العناوين (Headers) لتنظيم المعلومات.
   - استخدم القوائم النقطية (Bullet points) للوضوح.
   - استخدم الجداول (Markdown Tables) للمقارنات أو عرض القيم الغذائية.
   - استخدم الخط العريض (Bold) للكلمات المفتاحية أو المصطلحات الهامة.

قواعد تنسيق الإجابة:
1. **الطول**: حافظ على الإجابات مختصرة ومفيدة. (بين 150-300 كلمة).
2. **الهيكل**:
   - ابدأ بملخص مباشر للإجابة.
   - قسم المعلومات إلى أقسام واضحة (مثلاً: ## النقاط الأساسية، ## التوصيات).
   - لا تستخدم مقدمات غير ضرورية مثل "بناءً على بحثي" أو "يسعدني مساعدتك".
   - لا تضع مراجع داخل النص مثل [1]، [2].
   - اختم دائماً بقسم "## المصادر الموثوقة" يحتوي على روابط كاملة.

جودة المصادر:
- أعطِ الأولوية للمصادر ذات الموثوقية العالية (WHO, CDC, NIH, Mayo Clinic, PubMed, الجامعات).
- تجنب المصادر الضعيفة (المدونات الشخصية، المواقع التجارية غير الطبية، وسائل التواصل الاجتماعي).

مثال على التنسيق الاحترافي (عربي):
## الملخص
يعتبر النظام الغذائي المتوازن أساس الصحة الجيدة والوقاية من الأمراض.

## المكونات الأساسية
- **الخضروات**: توفر الألياف والفيتامينات.
- **البروتين**: ضروري لبناء العضلات.

## مقارنة القيم (مثال)
| المكون | الفائدة | المصدر |
| :--- | :--- | :--- |
| أوميغا 3 | صحة القلب | الأسماك الدهنية |
| الكالسيوم | صحة العظام | الألبان، الورقيات |

## المصادر الموثوقة
1. https://www.who.int/news-room/fact-sheets/detail/healthy-diet
2. https://www.cdc.gov/nutrition/index.html
`;

const VALIDATION_PROMPT = `You are a strict content moderator for a Nutrition & Health AI Assistant.
Your task is to determine if the user's query is appropriate for a professional nutritionist or health expert to answer.

Appropriate queries include:
1. Questions about nutrition, diet, food science, and health.
2. Questions about medical conditions related to diet (e.g., diabetes, obesity).
3. Questions about professional practice for nutritionists (e.g., "How to track client progress?", "How to write a meal plan?", "Patient assessment").
4. Questions about interpreting lab results or supplements.
5. Questions about business management for nutrition clinics (e.g., "How to get clients?", "Best software for meal planning").

Inappropriate queries include:
1. Programming or coding questions (e.g., "Python code for BMI", "How to build a website").
2. General knowledge unrelated to health (e.g., "Who is the president?", "History of France").
3. Politics, entertainment, or technology unrelated to health tools.

Analyze the following query:
"{{QUERY}}"

Reply with a JSON object:
{
  "is_allowed": boolean,
  "reason": "short explanation"
}
Do not provide any other text.`;

type PerplexityRole = "system" | "user" | "assistant";
type PerplexityMessage = { role: PerplexityRole; content: string };

async function perplexityChat(messages: PerplexityMessage[]) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    return { ok: false as const, status: 500, error: "PERPLEXITY_API_KEY غير مضبوط على الخادم." };
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), PERPLEXITY_TIMEOUT_MS);

  try {
    const res = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: PERPLEXITY_MODEL,
        messages,
        temperature: 0.2,
        top_p: 0.9,
        return_citations: true,
        return_images: false,
        return_related_questions: false,
        search_domain_filter: [],
      }),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        data?.error?.message || data?.error || data?.message || `Perplexity Error ${res.status}`;
      return { ok: false as const, status: res.status, error: message };
    }

    const answer = data?.choices?.[0]?.message?.content ?? "";
    const citations: string[] = Array.isArray(data?.citations) ? data.citations : [];
    return { ok: true as const, status: 200, answer, citations };
  } catch (e: any) {
    const msg = e?.name === "AbortError" ? "Perplexity timeout" : e?.message || "Perplexity request failed";
    return { ok: false as const, status: 502, error: msg };
  } finally {
    clearTimeout(t);
  }
}

async function validateQuery(query: string) {
  const response = await perplexityChat([
    { role: "user", content: VALIDATION_PROMPT.replace("{{QUERY}}", query) },
  ]);

  if (!response.ok) {
    return { isValid: false, reason: response.error };
  }

  const jsonMatch = response.answer.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { isValid: true as const };

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed?.is_allowed === true) return { isValid: true as const };
    return { isValid: false as const, reason: parsed?.reason || "Not allowed" };
  } catch {
    return { isValid: true as const };
  }
}

function postProcessAnswer(answer: string, citations: string[]) {
  const LOW_QUALITY_DOMAINS = [
    "youtube.com",
    "youtu.be",
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "tiktok.com",
    "pinterest.com",
    "linkedin.com",
    "reddit.com",
    "quora.com",
    "scribd.com",
    "slideshare.net",
    "blogspot.com",
    "wordpress.com",
    "medium.com",
  ];

  const HIGH_QUALITY_DOMAINS = [
    ".gov",
    ".edu",
    ".org",
    "who.int",
    "nih.gov",
    "cdc.gov",
    "nhs.uk",
    "mayoclinic.org",
    "clevelandclinic.org",
    "harvard.edu",
    "eatright.org",
    "heart.org",
    "medlineplus.gov",
    "nutritioncare.org",
    "espen.org",
    "wiley.com",
    "sciencedirect.com",
    "nature.com",
    "bmj.com",
    "lancet.com",
    "webmd.com",
    "healthline.com",
    "medicalnewstoday.com",
  ];

  const filteredCitations = citations.filter((url) => {
    const lower = String(url || "").toLowerCase();
    if (!lower) return false;
    if (LOW_QUALITY_DOMAINS.some((d) => lower.includes(d))) return false;
    return true;
  });

  const highQuality = filteredCitations.filter((url) =>
    HIGH_QUALITY_DOMAINS.some((d) => url.toLowerCase().includes(d))
  );
  const others = filteredCitations.filter(
    (url) => !HIGH_QUALITY_DOMAINS.some((d) => url.toLowerCase().includes(d))
  );

  let finalCitations = [...highQuality.slice(0, 4), ...others].slice(0, 5);
  if (finalCitations.length === 0 && citations.length > 0) finalCitations = citations.slice(0, 3);

  let cleaned = answer || "";
  cleaned = cleaned.replace(/\[\d+(?:,\s*\d+)*\]/g, "");
  cleaned = cleaned.replace(/\[Source\s*\d+\]/gi, "").replace(/\(Source\s*\d+\)/gi, "");

  const forbiddenPhrases = [
    "As a clinical dietitian",
    "In my clinic",
    "In my practice",
    "I advise my patients",
    "As an AI",
    "As a language model",
    "I am a nutrition assistant",
    "Based on my research",
    "According to the search results",
    "بناءً على بحثي",
    "بصفتي مساعد ذكاء اصطناعي",
    "أنا هنا للمساعدة",
  ];

  for (const phrase of forbiddenPhrases) {
    const re = new RegExp(phrase, "gi");
    cleaned = cleaned.replace(re, "");
  }

  cleaned = cleaned.replace(/[ \t]{2,}/g, " ").trim();

  const isArabic = /[\u0600-\u06FF]/.test(cleaned);
  cleaned += isArabic ? MEDICAL_DISCLAIMER_AR : MEDICAL_DISCLAIMER_EN;

  return { answer: cleaned, sources: finalCitations };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.length < 3) {
      return NextResponse.json({ error: "Message must be at least 3 characters long." }, { status: 400 });
    }
    if (message.length > 500) {
      return NextResponse.json({ error: "Message cannot exceed 500 characters." }, { status: 400 });
    }

    const validation = await validateQuery(message);
    if (!validation.isValid) {
      return NextResponse.json(
        { answer: "عذراً، أنا متخصص فقط في الإجابة على الأسئلة المتعلقة بالتغذية والصحة.", sources: [] },
        { status: 200 }
      );
    }

    const contextEnhancedQuery = `${message}\n\n(Context: Please answer this professionally. Use formal Arabic if the question is in Arabic. Use Markdown tables for comparisons if relevant. Ensure the tone is expert yet accessible.)`;

    const response = await perplexityChat([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: contextEnhancedQuery },
    ]);

    if (!response.ok) {
      return NextResponse.json({ error: response.error }, { status: response.status });
    }

    const processed = postProcessAnswer(response.answer, response.citations);
    return NextResponse.json(processed, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to process the request." }, { status: 500 });
  }
}
