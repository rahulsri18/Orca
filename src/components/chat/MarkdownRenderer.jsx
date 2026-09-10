import React from 'react';

/**
 * Lightweight, safe React component to render Markdown text formatted by Gemini/ORCA.
 * Supports headings, bold, italic, bullet lists, numbered lists, blockquotes, and paragraphs.
 */
export function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  // Split by line breaks
  const lines = content.split('\n');
  const elements = [];
  let currentList = null;
  let listType = null; // 'ul' or 'ol'

  const flushList = () => {
    if (currentList && currentList.length > 0) {
      if (listType === 'ul') {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-2 space-y-1 list-disc list-inside text-slate-700">
            {currentList}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${elements.length}`} className="my-2 space-y-1 list-decimal list-inside text-slate-700">
            {currentList}
          </ol>
        );
      }
      currentList = null;
      listType = null;
    }
  };

  const formatInline = (text) => {
    if (!text) return '';
    const parts = [];
    let keyIdx = 0;

    // Regex for bold, italic, code
    const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`)(.*?)\5/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      if (match[1]) {
        // Bold
        parts.push(
          <strong key={`b-${keyIdx++}`} className="font-bold text-slate-900">
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        // Italic
        parts.push(
          <em key={`i-${keyIdx++}`} className="italic text-slate-800">
            {match[4]}
          </em>
        );
      } else if (match[5]) {
        // Inline code
        parts.push(
          <code key={`c-${keyIdx++}`} className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-ocean-deep border border-slate-200">
            {match[6]}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Empty lines
    if (!trimmed) {
      flushList();
      return;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushList();
      elements.push(<hr key={`hr-${idx}`} className="my-3 border-slate-200" />);
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${idx}`} className="text-sm font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5">
          {formatInline(trimmed.replace(/^###\s+/, ''))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${idx}`} className="text-base font-extrabold text-ocean-deep mt-3.5 mb-1.5">
          {formatInline(trimmed.replace(/^##\s+/, ''))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${idx}`} className="text-lg font-black text-ocean-deep mt-4 mb-2">
          {formatInline(trimmed.replace(/^#\s+/, ''))}
        </h2>
      );
      return;
    }

    // Blockquotes / Alerts
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={`bq-${idx}`} className="my-2 pl-3 border-l-4 border-ocean-teal bg-sky-50/60 py-1.5 pr-2 rounded-r-lg text-xs text-slate-700 italic">
          {formatInline(trimmed.replace(/^>\s+/, ''))}
        </blockquote>
      );
      return;
    }

    // Bullet lists (* or -)
    const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
        currentList = [];
      }
      currentList.push(
        <li key={`li-${idx}`} className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-1">
          {formatInline(bulletMatch[1])}
        </li>
      );
      return;
    }

    // Numbered lists (1. , 2. )
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
        currentList = [];
      }
      currentList.push(
        <li key={`li-${idx}`} className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-1">
          {formatInline(numberedMatch[2])}
        </li>
      );
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${idx}`} className="text-xs sm:text-sm text-slate-800 leading-relaxed my-1.5 font-normal">
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className={`markdown-body space-y-1 ${className}`}>{elements}</div>;
}
