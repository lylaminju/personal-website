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
  let currentOrderedList = null;
  for (let i = 0; i < listItemCount; i++) {
    const item = listItems[i];

    if (item.isOrdered) {
      // Start a new ordered list if we don't have one
      if (!currentOrderedList) {
        currentOrderedList = [];
      }
      let li = `<li value="${item.value}">${item.content}`;

      // Look ahead for nested unordered items
      let j = i + 1;
      const subItems = [];
      while (
        j < listItemCount &&
        listItems[j].indent > item.indent &&
        !listItems[j].isOrdered
      ) {
        subItems.push(`<li>${listItems[j].content}</li>`);
        j++;
      }

      // Add nested unordered list if we found sub-items
      if (subItems.length > 0) {
        li += `\n<ul>${subItems.join('\n')}</ul>`;
      }

      li += '</li>';
      currentOrderedList.push(li);
      i = j - 1; // Skip processed subitems
    }

    // Close the ordered list when we reach an unordered item at base level
    // or the end of the items
    if ((!item.isOrdered && item.indent === 0) || i === listItemCount - 1) {
      if (currentOrderedList) {
        const replacement = `\n<ol>\n${currentOrderedList.join('\n')}</ol>\n`;
        html = html.replace(
          new RegExp(`__LIST_ITEM_${i - currentOrderedList.length + 1}__`),
          replacement
        );
        // Clear remaining placeholders for the items we processed
        for (let k = 1; k < currentOrderedList.length; k++) {
          html = html.replace(
            new RegExp(
              `__LIST_ITEM_${i - currentOrderedList.length + 1 + k}__`
            ),
            ''
          );
        }
        currentOrderedList = null;
      }
    }
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
