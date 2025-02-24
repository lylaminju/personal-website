# Parsing Markdown to HTML


## Ordered List

1. Level 1
  - Level 2
    1. Level 3
  - Back to level 2
2. Back to level 1
3. Back to level 1 again

## Unordered List

- Level 1
  - Level 2
    - Level 3
  - Back to level 2
- Back to level 1
  1. Level 2


## Escaping Characters

< "Hello" & 'World' >


## Code Block

※ Highlighting syntax is only supported in JavaScript code blocks

```js
export function parseMarkdownToHtml(markdown) {
  return markdown.replace(/^```js\n([\s\S]*?)\n```$/gm, '<pre><code class="language-js">$1</code></pre>');
}
```

```js
const calculateTotal = async (element, count = 0) => {
  let sum = 0;
  const TAX_RATE = 0.1;
  const prices = [10.99, 24.50, 35.75];

  for (let i = 0; i < prices.length; i++) {
    sum += prices[i];
  }

  if (count > 0 && sum > 100) {
    sum *= 0.9; // 10% discount
  }

  try {
    await processPayment(sum);
    return sum * (1 + TAX_RATE);
  } catch (error) {
    console.error(`Payment failed: ${error.message}`);
    return -1;
  }
};

// Testing object methods
class ShoppingCart {
  constructor() {
    this.items = new Map();
  }

  addItem(item, price) {
    this.items.set(item, price);
  }
}
```
