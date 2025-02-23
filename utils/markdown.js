export function markdownToHtml(markdown) {
  if (!markdown) return '';

  let html = markdown;

  // Convert code blocks (```) with language support
  const noPtag = 'NO-P-TAG';
  const codeBlocks = [];
  let codeBlockCount = 0;
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlockCount}__`;
    const language = lang ? ` class="language-${lang}"` : '';
    // Add NO_P_TAG to each line in code blocks
    const cleanCode = code
      .trim()
      .split('\n')
      .map((line) => `${noPtag}${line}`)
      .join('\n');

    codeBlocks[
      codeBlockCount
    ] = `<pre><code${language}>${cleanCode}</code></pre>`;
    codeBlockCount++;

    return placeholder;
  });

  // Convert inline code (`) but not inside code blocks
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Restore code blocks
  codeBlocks.forEach((block, i) => {
    html = html.replace(`__CODE_BLOCK_${i}__`, block);
  });

  // Convert headers (#, ##, ###)
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Convert emphasis text (**, __, *, _)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Convert links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Convert images ![alt](url)
  html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // Convert unordered lists (-, *, +) and ordered lists (1. 2. etc)
  const listItems = [];
  let listItemCount = 0;

  // First, collect all list items with their indentation level
  html = html.replace(
    /^(\s*)([-+*]|\d+\.)\s+(.*)/gm,
    (match, indent, marker, content) => {
      const placeholder = `__LIST_ITEM_${listItemCount}__`;
      const isOrdered = /^\d+\./.test(marker);
      const value = isOrdered ? marker.replace('.', '') : '';

      listItems[listItemCount] = {
        content,
        indent: indent.length,
        isOrdered,
        value,
      };

      listItemCount++;
      return placeholder;
    }
  );

  // Then, process list items and create nested structure
  for (let i = 0; i < listItemCount; i++) {
    const item = listItems[i];
    const li = item.isOrdered
      ? `<li value="${item.value}">${item.content}</li>`
      : `<li>${item.content}</li>`;

    // Look ahead to determine if we need to start a new sublist
    let sublist = '';
    if (i + 1 < listItemCount && listItems[i + 1].indent > item.indent) {
      let j = i + 1;
      const subItems = [];
      const isSubOrdered = listItems[j].isOrdered;

      while (j < listItemCount && listItems[j].indent > item.indent) {
        subItems.push(
          listItems[j].isOrdered
            ? `<li value="${listItems[j].value}">${listItems[j].content}</li>`
            : `<li>${listItems[j].content}</li>`
        );
        j++;
      }

      sublist = isSubOrdered
        ? `\n<ol>${subItems.join('\n')}</ol>\n`
        : `\n<ul>${subItems.join('\n')}</ul>\n`;

      // Skip processed subitems
      i = j - 1;
    }

    const list = item.isOrdered ? 'ol' : 'ul';
    const replacement = `\n<${list}>\n${li}${sublist}</${list}>\n`;
    html = html.replace(`__LIST_ITEM_${i}__`, replacement);
  }

  // Make sure all list placeholders are removed before paragraph conversion
  html = html.replace(/__LIST_ITEM_\d+__/g, '');

  // Convert paragraphs (text separated by blank lines)
  html = html.replace(/^(?!<(?:h[1-6]|ul|ol|li))(.*$)/gm, (match) => {
    if (match.trim() === '' || match.startsWith(noPtag)) return match;
    return `<p>${match}</p>`;
  });

  // Remove no-p-tag markers
  html = html.replace(new RegExp(noPtag, 'g'), '');

  // Add syntax highlighting classes
  html = html.replace(
    /(<pre><code class="language-js">)([\s\S]*?)(<\/code><\/pre>)/g,
    (match, start, code, end) => {
      // Strings (both single and double quotes)
      let highlightedCode = code.replace(
        /(["'`])(.*?)\1/g,
        '<span class="string">$1$2$1</span>'
      );

      // Functions
      highlightedCode = highlightedCode.replace(
        /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
        '<span class="function">$1</span>('
      );

      // Numbers
      highlightedCode = highlightedCode.replace(
        /\b(\d+(\.\d+)?)\b/g,
        '<span class="number">$1</span>'
      );

      // Comments (single line)
      highlightedCode = highlightedCode.replace(
        /(\/\/.*$)/gm,
        '<span class="comment">$1</span>'
      );

      // Keywords
      highlightedCode = highlightedCode.replace(
        /\b(const|let|var|function|return|async|await|if|else|for|while|class|export|import|from)\s(?!\s)/g,
        '<span class="keyword">$1</span> '
      );

      // Remove p tags
      highlightedCode = highlightedCode.replace(/<\/?p>/g, '');

      return `${start}${highlightedCode}${end}`;
    }
  );

  return html;
}
