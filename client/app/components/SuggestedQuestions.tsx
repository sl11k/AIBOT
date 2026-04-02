"use client";

const SUGGESTIONS: string[] = [
  "أفضل خطة تغذية لإدارة الوزن",
  "كيفية متابعة تقدم العملاء بفعالية",
  "توصيات التغذية العلاجية لمرضى السكري",
  "أهمية المغذيات الكبرى في التغذية الرياضية",
  "كيفية إعداد خطة وجبات متوازنة",
];

export function SuggestedQuestions({
  onSelect,
  disabled,
}: {
  onSelect: (question: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="px-6 pb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 bg-[var(--nc-primary)] rounded-full"></div>
        <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider">
          اقتراحات البحث السريع
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            disabled={disabled}
            className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-[13px] font-bold text-zinc-600 hover:bg-emerald-50 hover:border-[var(--nc-primary)] hover:text-[var(--nc-primary)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

