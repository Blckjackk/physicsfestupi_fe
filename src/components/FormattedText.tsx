/**
 * FormattedText Component
 * Renders text with formatting tags as styled HTML
 * Supports markdown-style formatting from toolbar
 */

import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export default function FormattedText({ text, className = '' }: FormattedTextProps) {
  // Function to parse and convert formatting tags to HTML
  const parseFormatting = (input: string): string => {
    let output = input;

    // Bold: **text** → <strong>text</strong>
    output = output.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text* → <em>text</em>
    output = output.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');

    // Underline: __text__ → <u>text</u>
    output = output.replace(/__(.*?)__/g, '<u>$1</u>');

    // Heading: # text → <h3>text</h3>
    output = output.replace(/^# (.+)$/gm, '<h3 class="text-lg font-bold mb-2">$1</h3>');

    // Bullet point: • text → <li>text</li>
    output = output.replace(/^• (.+)$/gm, '<li class="ml-4">$1</li>');

    // Wrap consecutive <li> tags in <ul>
    output = output.replace(/(<li.*?<\/li>\n?)+/g, '<ul class="list-disc list-inside mb-2">$&</ul>');

    // Paragraph breaks: double newline
    output = output.replace(/\n\n/g, '<br/><br/>');

    // Single newline
    output = output.replace(/\n/g, '<br/>');

    // Custom tags - Align Left
    output = output.replace(/\[align-left\](.*?)\[\/align-left\]/g, '<div class="text-left">$1</div>');

    // Custom tags - Align Center
    output = output.replace(/\[align-center\](.*?)\[\/align-center\]/g, '<div class="text-center">$1</div>');

    // Custom tags - Align Right
    output = output.replace(/\[align-right\](.*?)\[\/align-right\]/g, '<div class="text-right">$1</div>');

    // Custom tags - Color (example, you can enhance this)
    output = output.replace(/\[color\](.*?)\[\/color\]/g, '<span class="text-purple-600">$1</span>');

    // Custom tags - Script/Math notation (subscript example)
    output = output.replace(/\[script\](.*?)\[\/script\]/g, '<sub>$1</sub>');

    return output;
  };

  const formattedHtml = parseFormatting(text);

  return (
    <div
      className={`formatted-text ${className}`}
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
}
