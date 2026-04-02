"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const allowedElements = [
  "p", "br", "strong", "em", "code", "pre", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "blockquote", "a", "table", "thead", "tbody", "tr", "th", "td",
];

export function SafeMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      allowedElements={allowedElements}
      unwrapDisallowed
      components={{
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--nc-primary)] underline underline-offset-2 font-semibold hover:text-[var(--nc-primary-dark)] transition-colors"
          >
            {children}
          </a>
        ),
        code: ({ className, children }) =>
          className ? (
            <code className={`${className} bg-zinc-100 p-1 rounded text-xs`}>{children}</code>
          ) : (
            <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700 font-mono text-xs">
              {children}
            </code>
          ),
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto rounded-lg border border-zinc-200">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-zinc-50">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left font-semibold text-zinc-900 border-b border-zinc-200">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <th className="px-4 py-2 text-left text-zinc-700 border-b border-zinc-100 font-normal">
            {children}
          </th>
        ),
        h1: ({ children }) => <h1 className="text-xl font-bold mt-6 mb-2 text-zinc-900">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-bold mt-5 mb-2 text-zinc-900">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-bold mt-4 mb-1 text-zinc-900">{children}</h3>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4">{children}</ol>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

