"use client";

export function LoadingIndicator() {
  return (
    <div className="flex justify-start px-4 py-2">
      <div className="flex gap-1.5 rounded-[12px] bg-white border border-[var(--nc-border)] px-4 py-3">
        <span
          className="w-2 h-2 rounded-full bg-[var(--nc-primary-light)] animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-[var(--nc-primary-light)] animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-[var(--nc-primary-light)] animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
