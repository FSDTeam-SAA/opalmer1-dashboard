"use client";

import DOMPurify from "dompurify";

export default function PolicyHtmlPreview({ html }: { html: string }) {
  const safe = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "div",
      "span",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "strike",
      "blockquote",
      "ol",
      "ul",
      "li",
      "a",
      "sub",
      "sup",
      "hr",
    ],
    ALLOWED_ATTR: ["style", "href", "target", "rel"],
  });
  return (
    <div
      className="policy-content prose prose-slate max-w-none break-words"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
