import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const MEDICAL_DISCLAIMER_EN =
  "\n\n--- \n*Disclaimer: This information is for educational purposes only and does not substitute professional medical advice. Always consult a qualified healthcare provider for medical concerns.*";
const MEDICAL_DISCLAIMER_AR =
  "\n\n--- \n*تنويه: هذه المعلومات للأغراض التعليمية فقط ولا تغني عن الاستشارة الطبية المتخصصة. يرجى دائماً استشارة مقدم الرعاية الصحية المؤهل في حال وجود مخاوف طبية.*";

const SYSTEM_PROMPT = `أنت نورا، مساعد ذكاء اصطناعي متخصص في مجال التغذية والصحة ضمن منصة NutriCare.

الهدف:
تقديم إجابات دقيقة، مبنية على الأدلة العلمية، ومنظمة بشكل احترافي حول التغذية، الأنظمة الغذائية، والصحة العامة.

نطاق العمل:
أنتِ متخصصة بشكل رئيسي في:
- التغذية، الحميات الغذائية، الأكل الصحي، السعرات الحرارية، والمغذيات الكبرى (البروتين، الكربوهيدرات، الدهون).
- الفيتامينات، المعادن، الترطيب، الهضم، وصحة الجهاز الهضمي.
- إدارة الوزن، التغذية الرياضية، والتغذية العلاجية.
- تخطيط الوجبات، جودة الغذاء، سلامة الغذاء، والصحة الأيضية.
- الممارسة المهنية لأخصائيي التغذية (متابعة العملاء، إدارة العيادات).
- الطهي، الوصفات الصحية، بدائل المكونات الغذائية.
- اللياقة البدنية والرياضة من منظور تغذوي.
- الصحة النفسية المتعلقة بالتغذية (اضطرابات الأكل، الأكل العاطفي).

التعامل مع الأسئلة:
- أجب على كل سؤال متعلق بالتغذية أو الصحة أو الغذاء أو الطبخ الصحي بشكل مفصل ومفيد.
- إذا كان السؤال مرتبطاً ولو بشكل بسيط بالتغذية أو الصحة، أجب عليه بشكل طبيعي.
- إذا كان السؤال عاماً (مثل تحية أو سؤال عن حالك)، رد بلطف وأعد توجيه المحادثة للتغذية.
- فقط إذا كان السؤال لا علاقة له إطلاقاً بالصحة أو التغذية (مثل البرمجة، السياسة، التاريخ)، أخبر المستخدم بلطف أن تخصصك هو التغذية والصحة واعرض المساعدة في هذا المجال.

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

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}
const AI_MODEL = "gpt-4.1";

type ChatRole = "system" | "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

async function aiChat(messages: ChatMessage[]) {
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: AI_MODEL,
      messages,
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 2048,
    });

    const answer = completion.choices?.[0]?.message?.content ?? "";
    return { ok: true as const, status: 200, answer };
  } catch (e: any) {
    const msg = e?.message || "AI request failed";
    return { ok: false as const, status: 502, error: msg };
  }
}

function postProcessAnswer(answer: string) {
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

  // Extract URLs from the answer text
  const urlRegex = /https?:\/\/[^\s)\]>,"""]+/g;
  const citations: string[] = [...new Set((answer.match(urlRegex) || []).map(u => u.replace(/[.,;:!؟?]+$/, '')))];

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

    const contextEnhancedQuery = `${message}\n\n(Context: Please answer this professionally. Use formal Arabic if the question is in Arabic. Use Markdown tables for comparisons if relevant. Ensure the tone is expert yet accessible.)`;

    const response = await aiChat([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: contextEnhancedQuery },
    ]);

    if (!response.ok) {
      return NextResponse.json({ error: response.error }, { status: response.status });
    }

    const processed = postProcessAnswer(response.answer);
    return NextResponse.json(processed, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to process the request." }, { status: 500 });
  }
}
