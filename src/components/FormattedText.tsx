/**
 * FormattedText Component
 * Renders text with formatting tags as styled HTML
 * Supports markdown-style formatting from toolbar
 */

import React from 'react';

interface FormattedTextProps {
  text: string | null | undefined;
  className?: string;
}

export default function FormattedText({ text, className = '' }: FormattedTextProps) {
  if (!text) return null;

  // Backend returns raw HTML from contenteditable
  // Just render it directly - no conversion needed for new data
  let processedText = text;
  
  // ONLY convert if contains BBCode tags (old data backward compatibility)
  const hasBBCode = processedText.includes('[') && processedText.includes(']');
  
  if (hasBBCode) {
    // Remove BBCode alignment tags - they're already converted to inline styles in new editor
    processedText = processedText
      .replace(/\[align-left\](.*?)\[\/align-left\]/g, '<div style="text-align: left;">$1</div>')
      .replace(/\[align-center\](.*?)\[\/align-center\]/g, '<div style="text-align: center;">$1</div>')
      .replace(/\[align-right\](.*?)\[\/align-right\]/g, '<div style="text-align: right;">$1</div>')
      .replace(/\[justify\](.*?)\[\/justify\]/g, '<div style="text-align: justify;">$1</div>')
      .replace(/\[sup\](.*?)\[\/sup\]/g, '<sup>$1</sup>')
      .replace(/\[sub\](.*?)\[\/sub\]/g, '<sub>$1</sub>')
      .replace(/\[vector\](.*?)\[\/vector\]/g, '<span style="text-decoration: overline;">$1</span>')
      .replace(/\[frac\](.*?)\|(.*?)\[\/frac\]/g, '<span style="display: inline-flex; flex-direction: column; vertical-align: middle; font-size: 0.85em; line-height: 1; margin: 0 1px;"><span style="border-bottom: 1px solid currentColor; padding: 0 3px; text-align: center;">$1</span><span style="padding: 0 3px; text-align: center;">$2</span></span>')
      .replace(/\[indent\](.*?)\[\/indent\]/g, '<div style="margin-left: 2rem;">$1</div>')
      .replace(/\[outdent\](.*?)\[\/outdent\]/g, '<div style="margin-left: 0;">$1</div>');
  }

  return (
    <div
      className={`formatted-text ${className}`}
      dangerouslySetInnerHTML={{ __html: processedText }}
    />
  );
}
