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
  const DEFAULT_INDENT = 2;
  // First, handle unordered and ordered lists with indentation
  html = html.replace(/^( *)[-*+] (.+)$/gm, (match, indent, content) => {
    const level = indent.length / DEFAULT_INDENT;
    return `<li class="ul-item" data-level="${level}">${content}</li>`;
  });

  html = html.replace(/^( *)\d+\. (.+)$/gm, (match, indent, content) => {
    const level = indent.length / DEFAULT_INDENT;
    return `<li class="ol-item" data-level="${level}">${content}</li>`;
  });

  // Process nested lists
  const processNestedList = (items, type, level = 0) => {
    let result = `<${type}>`;
    let i = 0;
    while (i < items.length) {
      const match = items[i].match(
        /<li class="([uo]l)-item" data-level="(\d+)">(.*?)<\/li>/
      );
      if (!match) {
        i++;
        continue;
      }

      const [_, itemType, itemLevel, content] = match;
      const currentLevel = parseInt(itemLevel);
      if (currentLevel === level) {
        result += `<li>${content}`;

        // Look ahead for nested items at ANY higher level
        const subItems = [];
        let j = i + 1;
        while (j < items.length) {
          const nextMatch = items[j].match(
            /<li class="[uo]l-item" data-level="(\d+)">/
          );
          if (nextMatch && parseInt(nextMatch[1]) > level) {
            subItems.push(items[j]);
            j++;
          } else {
            break;
          }
        }

        if (subItems.length > 0) {
          const subType = subItems[0].includes('ul-item') ? 'ul' : 'ol';
          result += processNestedList(subItems, subType, level + 1);
        }
        result += '</li>';
        i = j;
      } else {
        i++;
      }
    }
    result += `</${type}>`;
    return result;
  };

  // Find consecutive list items and process them
  html = html.replace(
    /(?:^|\n)((?:<li class="[uo]l-item".*?<\/li>\n?)+)(?=\n|$)/g,
    (match, listGroup) => {
      const items = listGroup.match(/(<li class="[uo]l-item".*?<\/li>)/g) || [];
      if (items.length === 0) return match;

      // Determine the type of the root list based on the first item at level 0
      const firstRootItem = items.find((item) =>
        item.includes('data-level="0"')
      );
      if (!firstRootItem) return match;

      const isOrdered = firstRootItem.includes('ol-item');
      const rootType = isOrdered ? 'ol' : 'ul';

      return processNestedList(items, rootType);
    }
  );

  // Clean up the temporary attributes
  html = html.replace(/class="[uo]l-item"\s*data-level="\d+"/g, '');

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
