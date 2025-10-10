/**
 * RichTextInput Component
 * ContentEditable input with real-time formatting preview
 * Stores data as markdown tags for backend compatibility
 */

import React, { useRef, useEffect } from 'react';

interface RichTextInputProps {
  id: string;
  value: string; // Markdown format from backend
  onChange: (markdownValue: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextInput({
  id,
  value = '',
  onChange,
  placeholder = 'Masukkan teks...',
  className = '',
}: RichTextInputProps) {
  const editableRef = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);
  const isUserTyping = useRef(false);

  // Convert markdown to HTML for display
  const markdownToHtml = (markdown: string): string => {
    // Handle null, undefined, or empty string
    if (!markdown) return '';
    
    let html = markdown;

    // Bold: **text** → <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text* → <em>text</em>
    html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');

    // Underline: __text__ → <u>text</u>
    html = html.replace(/__(.*?)__/g, '<u>$1</u>');

    // Heading: # text → <h3>text</h3>
    html = html.replace(/^# (.+)$/gm, '<h3 style="font-size: 1.125rem; font-weight: 600; margin-top: 0.5rem; margin-bottom: 0.25rem;">$1</h3>');

    // Bullet: • text → <li>text</li>
    html = html.replace(/^• (.+)$/gm, '<li style="margin-left: 1rem;">$1</li>');
    html = html.replace(/(<li.*?<\/li>\n?)+/g, '<ul style="list-style-type: disc; margin-left: 1.5rem; margin-bottom: 0.5rem;">$&</ul>');

    // Alignment tags
    html = html.replace(/\[align-left\]([\s\S]*?)\[\/align-left\]/g, '<div style="text-align: left;">$1</div>');
    html = html.replace(/\[align-center\]([\s\S]*?)\[\/align-center\]/g, '<div style="text-align: center;">$1</div>');
    html = html.replace(/\[align-right\]([\s\S]*?)\[\/align-right\]/g, '<div style="text-align: right;">$1</div>');
    html = html.replace(/\[justify\]([\s\S]*?)\[\/justify\]/g, '<div style="text-align: justify;">$1</div>');

    // Indent/Outdent
    html = html.replace(/\[indent\]([\s\S]*?)\[\/indent\]/g, '<div style="margin-left: 2rem;">$1</div>');
    html = html.replace(/\[outdent\]([\s\S]*?)\[\/outdent\]/g, '<div style="margin-left: 0;">$1</div>');

    // Color
    html = html.replace(/\[color\]([\s\S]*?)\[\/color\]/g, '<span style="color: rgb(147, 51, 234);">$1</span>');

    // Script (subscript)
    html = html.replace(/\[sub\]([\s\S]*?)\[\/sub\]/g, '<sub>$1</sub>');
    
    // Superscript (pangkat)
    html = html.replace(/\[sup\]([\s\S]*?)\[\/sup\]/g, '<sup>$1</sup>');
    
    // Vector (dengan arrow)
    html = html.replace(/\[vector\]([\s\S]*?)\[\/vector\]/g, '<span style="position: relative; display: inline-block;"><span>$1</span><span style="position: absolute; top: -2px; left: 0; right: 0; height: 1px; border-top: 1px solid currentColor; font-size: 0.8em;">→</span></span>');
    
    // Fraction (pecahan)
    html = html.replace(/\[frac\]([\s\S]*?)\[\/frac\]/g, (match, content) => {
      const parts = content.split('|');
      if (parts.length === 2) {
        return `<span style="display: inline-block; vertical-align: middle; text-align: center; line-height: 1;"><span style="display: block; border-bottom: 1px solid currentColor; padding-bottom: 1px; font-size: 0.9em;">${parts[0]}</span><span style="display: block; padding-top: 1px; font-size: 0.9em;">${parts[1]}</span></span>`;
      }
      return content;
    });

    // Legacy script support
    html = html.replace(/\[script\]([\s\S]*?)\[\/script\]/g, '<sub>$1</sub>');

    // Line breaks
    html = html.replace(/\n\n/g, '<br/><br/>');
    html = html.replace(/\n/g, '<br/>');

    return html;
  };

  // Convert HTML back to markdown for backend
  const htmlToMarkdown = (html: string): string => {
    // Handle null, undefined, or empty string
    if (!html) return '';
    
    let markdown = html;

    // Remove <br/> tags
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

    // Strong → **text**
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
    markdown = markdown.replace(/<b>(.*?)<\/b>/gi, '**$1**');

    // Em → *text*
    markdown = markdown.replace(/<em>(.*?)<\/em>/gi, '*$1*');
    markdown = markdown.replace(/<i>(.*?)<\/i>/gi, '*$1*');

    // Underline → __text__
    markdown = markdown.replace(/<u>(.*?)<\/u>/gi, '__$1__');

    // Heading
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '# $1');

    // List items (from execCommand)
    markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
      const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
      if (items) {
        return items.map((item: string) => {
          const text = item.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '$1').trim();
          return '• ' + text;
        }).join('\n') + '\n';
      }
      return '';
    });

    // Alignment divs (from execCommand - uses different attribute format)
    // execCommand uses align attribute or text-align style
    markdown = markdown.replace(/<div[^>]*align=["']?left["']?[^>]*>([\s\S]*?)<\/div>/gi, '[align-left]$1[/align-left]');
    markdown = markdown.replace(/<div[^>]*align=["']?center["']?[^>]*>([\s\S]*?)<\/div>/gi, '[align-center]$1[/align-center]');
    markdown = markdown.replace(/<div[^>]*align=["']?right["']?[^>]*>([\s\S]*?)<\/div>/gi, '[align-right]$1[/align-right]');
    markdown = markdown.replace(/<div[^>]*align=["']?justify["']?[^>]*>([\s\S]*?)<\/div>/gi, '[justify]$1[/justify]');
    
    // Also handle text-align style format
    markdown = markdown.replace(/<div[^>]*style=["'][^"']*text-align:\s*left[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi, '[align-left]$1[/align-left]');
    markdown = markdown.replace(/<div[^>]*style=["'][^"']*text-align:\s*center[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi, '[align-center]$1[/align-center]');
    markdown = markdown.replace(/<div[^>]*style=["'][^"']*text-align:\s*right[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi, '[align-right]$1[/align-right]');
    markdown = markdown.replace(/<div[^>]*style=["'][^"']*text-align:\s*justify[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi, '[justify]$1[/justify]');

    // Indent/Outdent
    markdown = markdown.replace(/<div style="margin-left:\s*2rem;">([\s\S]*?)<\/div>/gi, '[indent]$1[/indent]');
    markdown = markdown.replace(/<div style="margin-left:\s*0;">([\s\S]*?)<\/div>/gi, '[outdent]$1[/outdent]');

    // Color
    markdown = markdown.replace(/<span style="color:\s*rgb\(147,\s*51,\s*234\);">([\s\S]*?)<\/span>/gi, '[color]$1[/color]');

    // Subscript
    markdown = markdown.replace(/<sub>(.*?)<\/sub>/gi, '[sub]$1[/sub]');
    
    // Superscript
    markdown = markdown.replace(/<sup>(.*?)<\/sup>/gi, '[sup]$1[/sup]');
    
    // Vector (complex structure back to simple tag)
    markdown = markdown.replace(/<span[^>]*><span>(.*?)<\/span><span[^>]*>→<\/span><\/span>/gi, '[vector]$1[/vector]');
    
    // Fraction (complex structure back to simple tag)
    markdown = markdown.replace(/<span[^>]*><span[^>]*>(.*?)<\/span><span[^>]*>(.*?)<\/span><\/span>/gi, '[frac]$1|$2[/frac]');

    // Legacy script support
    markdown = markdown.replace(/<sub>(.*?)<\/sub>/gi, '[script]$1[/script]');

    // Clean up extra tags
    markdown = markdown.replace(/<[^>]+>/g, '');

    // Clean up multiple newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    return markdown.trim();
  };

  // Save and restore cursor position
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    return {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset,
    };
  };

  const restoreCursorPosition = (position: any) => {
    if (!position || !editableRef.current) return;
    try {
      const selection = window.getSelection();
      const range = document.createRange();
      range.setStart(position.startContainer, position.startOffset);
      range.setEnd(position.endContainer, position.endOffset);
      selection?.removeAllRanges();
      selection?.addRange(range);
    } catch (e) {
      // Cursor position restoration failed, ignore
    }
  };

  // Update display when value changes from parent (only on load, not during typing)
  useEffect(() => {
    if (editableRef.current && !isComposing.current && !isUserTyping.current) {
      const html = markdownToHtml(value);
      if (editableRef.current.innerHTML !== html) {
        editableRef.current.innerHTML = html || '';
      }
    }
  }, [value]);

  // Handle content changes
  const handleInput = () => {
    if (editableRef.current && !isComposing.current) {
      isUserTyping.current = true;
      const html = editableRef.current.innerHTML;
      const markdown = htmlToMarkdown(html);
      onChange(markdown);
      setTimeout(() => {
        isUserTyping.current = false;
      }, 100);
    }
  };

  // Handle paste - strip formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div
      ref={editableRef}
      id={id}
      contentEditable
      onInput={handleInput}
      onPaste={handlePaste}
      onCompositionStart={() => (isComposing.current = true)}
      onCompositionEnd={() => {
        isComposing.current = false;
        handleInput();
      }}
      className={`relative w-full bg-white px-4 py-4 font-inter text-sm text-gray-900 focus:outline-none min-h-[80px] ${className}`}
      data-placeholder={placeholder}
      style={{
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}
      suppressContentEditableWarning
    />
  );
}
