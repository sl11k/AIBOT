# NutriCare Chatbot — Design Specification

Premium healthcare SaaS chatbot UI aligned with NutriCare brand: professional, calm, human-centered, tech-enabled.

---

## 1. Layout Structure

- **Page:** Full-viewport column; background `#FAFAFA` (light neutral). Centered single column.
- **Chat container:** Max-width ~720px, centered, 8px grid vertical rhythm. White card (`#FFFFFF`) with soft shadow (`0 1px 3px rgba(0,0,0,0.06)`), border-radius 16px. Padding 24px (3 × 8px).
- **Header:** Fixed or sticky at top of card; logo + “NutriCare Assistant”; 16px bottom padding to separate from messages.
- **Message area:** Scrollable flex-1; padding 16px horizontal, 16px vertical between messages (8px grid).
- **Input area:** Rounded input row; helper text below; 24px top padding from messages. No sticky footer required if card scrolls as one unit; otherwise input can be sticky at bottom of card.

**UX reasoning:** Centered, bounded width keeps focus and readability; white card on grey separates chat from page and feels “product”; 8px grid creates consistent rhythm and alignment.

---

## 2. Component Breakdown

### Header
- **Role:** Brand + context.
- **Content:** NutriCare wordmark/logo (small) + title “NutriCare Assistant”. Optional short subtitle (e.g. “Powered by your documents”).
- **Spacing:** 16px vertical padding; 24px horizontal. 8px between logo and title.
- **Typography:** Title Inter Bold, 18px; subtitle Inter Medium, 13px, neutral grey (#71717A).

### MessageList
- **Role:** Scrollable thread; auto-scroll to latest message.
- **Spacing:** 16px between bubbles (2 × 8px); 16px horizontal padding; 24px top/bottom.
- **Empty state:** Centered, neutral grey text, 14px, encouraging placeholder (e.g. “Ask about nutrition plans, client progress, or insights…”).
- **Scroll:** Smooth scroll to bottom on new message; overflow-y auto; minimal scrollbar styling.

### MessageBubble (User)
- **Background:** Green 50 (`#ECFDF5`) — soft, supportive.
- **Text:** Dark grey (`#3F3F46` / zinc-700).
- **Border radius:** 12px (or 16px for slightly softer).
- **Padding:** 12px 16px (8px grid).
- **Max width:** ~85% of container; right-aligned.
- **Typography:** Inter Medium, 14px; line-height 1.5.

### MessageBubble (Assistant)
- **Background:** White (`#FFFFFF`).
- **Border:** 1px solid Grey 200 (`#E4E4E7`); left-aligned.
- **Border radius:** 12–16px.
- **Padding:** 12px 16px.
- **Max width:** ~85%; left-aligned.
- **Markdown:** Clean spacing; links in Primary green (#02BE6A); code blocks light grey bg (#F4F4F5), rounded 6px.

### ChatInput
- **Container:** Flex row; gap 12px; 16px padding.
- **Input:** Rounded 12px; border 1px #E4E4E7; padding 12px 16px; placeholder neutral (#71717A). Focus: border Primary green, no heavy ring.
- **Send button:** Background Green 700 (#02BE6A); text white; rounded 12px; padding 12px 20px. Disabled: background Grey 300 (#D4D4D8), cursor not-allowed.
- **Placeholder:** “Ask about nutrition plans, client progress, or insights…”
- **Helper text:** Below input, 12px, neutral grey: “AI assistant powered by NutriCare”. Character count optional, subtle.

### TypingIndicator
- **Style:** Three dots in Green 500 (#70EBAF); small (6–8px); left-aligned bubble matching assistant (white + grey border) or minimal container.
- **Animation:** Subtle bounce or pulse; delays 0ms, 150ms, 300ms. No gaming aesthetics.

---

## 3. Spacing System (8px Grid)

| Token   | Value | Usage                    |
|--------|--------|--------------------------|
| space-1 | 8px    | Tight gaps, icon padding |
| space-2 | 16px   | Between bubbles, section |
| space-3 | 24px   | Card padding, header     |
| space-4 | 32px   | Large sections          |
| space-5 | 40px   | Optional                 |
| space-6 | 48px   | Optional                 |

All padding/margin use multiples of 8px.

---

## 4. Color Tokens

| Token           | Hex       | Usage                    |
|-----------------|-----------|---------------------------|
| primary         | #02BE6A   | CTAs, links, focus       |
| primary-light   | #70EBAF   | Typing dots, accents     |
| green-50        | #ECFDF5   | User bubble bg           |
| background      | #FAFAFA   | Page bg                  |
| surface         | #FFFFFF   | Card, assistant bubble   |
| border          | #E4E4E7   | Input, assistant border  |
| border-light    | #F4F4F5   | Dividers                 |
| text            | #18181B   | Primary text             |
| text-muted      | #71717A   | Secondary, placeholder  |
| disabled        | #D4D4D8   | Disabled button          |

---

## 5. Tailwind Class Suggestions

- **Page:** `min-h-screen bg-[#FAFAFA] flex flex-col items-center py-8 px-4`
- **Card:** `w-full max-w-[720px] bg-white rounded-2xl shadow-sm border border-[#E4E4E7] overflow-hidden flex flex-col (min-h-[560px] or flex-1)`
- **Header:** `px-6 py-4 border-b border-[#F4F4F5]`
- **Message list:** `flex-1 overflow-y-auto px-4 py-4 space-y-4`
- **User bubble:** `bg-[#ECFDF5] text-zinc-700 rounded-[12px] px-4 py-3 max-w-[85%] ml-auto`
- **Assistant bubble:** `bg-white border border-[#E4E4E7] rounded-[12px] px-4 py-3 max-w-[85%]`
- **Input wrapper:** `p-4 border-t border-[#E4E4E7]`
- **Input field:** `rounded-xl border border-[#E4E4E7] px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-[#02BE6A] focus:outline-none focus:ring-1 focus:ring-[#02BE6A]`
- **Send button:** `rounded-xl bg-[#02BE6A] text-white px-5 py-3 font-medium hover:opacity-90 disabled:bg-[#D4D4D8] disabled:cursor-not-allowed transition-opacity`
- **Typing dots:** `w-2 h-2 rounded-full bg-[#70EBAF] animate-bounce`

---

## 6. Typography

- **Font:** Inter (Bold for headlines, Medium for body). Load via next/font or link.
- **Headline:** Inter Bold, 18px (or 1.125rem).
- **Body:** Inter Medium, 14px; line-height 1.5.
- **Helper/caption:** Inter Medium, 12px; color text-muted.

---

## 7. Micro-interactions & States

- **Hover (buttons):** Slight opacity 0.9 or darken 2–3%; no scale or heavy shadow.
- **Focus (input):** Border primary green; optional 1px ring primary at 20% opacity.
- **Loading:** Typing indicator only; no skeleton or flashy animation.
- **Error:** Soft red background (#FEF2F2), text #B91C1C; 12px padding; below input or above it.

---

## 8. UX Rationale Summary

- **Centered card:** Reduces cognitive load; feels like a dedicated tool, not a full-page app.
- **Green 50 user bubbles:** Associates user with brand green in a soft way; doesn’t compete with white assistant replies.
- **White assistant + grey border:** Clear hierarchy; readable; professional.
- **Rounded corners (12–16px):** Soft UI; approachable; healthcare-appropriate.
- **Generous white space:** Calm, breathable; avoids clutter.
- **Single accent (Green 700):** Buttons and links only; no neon or saturated tones.
- **Inter throughout:** Legible, neutral, professional; no decorative fonts.
- **Helper text under input:** Reinforces “AI powered by NutriCare” and trust without clutter.

Result: Premium healthcare SaaS chatbot that feels professional, supportive, and calm — not playful or corporate-heavy.
