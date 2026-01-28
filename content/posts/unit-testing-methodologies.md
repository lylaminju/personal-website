---
title: Unit Testing Methodologies
date: 2026-01-22
---

## Background

Before refactoring a project, I wrote unit tests to ensure behavior would be preserved. Here are the key methodologies I used.

## 1. Error Handling at System Boundaries

Validate graceful handling of invalid input where your code meets external data.

```ts
describe('formatShortDate', () => {
  it('returns undefined for invalid date', () => {
    expect(formatShortDate('invalid-date')).toBeUndefined();
  });
});
```

## 2. Boundary Value Testing

Test at the edges of valid ranges where special handling is required.

**Example: 12-hour time conversion**

```ts
describe('formatTimeToAMPM', () => {
  it('handles midnight (00:00)', () => {
    expect(formatTimeToAMPM('00:00')).toBe('12:00 AM');
  });

  it('handles noon (12:00)', () => {
    expect(formatTimeToAMPM('12:00')).toBe('12:00 PM');
  });
});
```

Midnight and noon are boundaries—`hour % 12` returns 0, requiring special logic to display "12" instead of "0".

## 3. Known Value Verification

For algorithms involving math or formulas, verify against known real-world values.

**Avoid testing against self-derived values:**

```ts
it('calculates distance', () => {
  const result = haversineDistance(toronto, montreal);
  expect(result).toBe(504.123); // Where did this come from?
});
```

If `504.123` came from running your implementation, you've just verified that your code returns what your code returns.

**Example: Haversine distance calculation**

```ts
describe('haversineDistance', () => {
  it('calculates Toronto to Montreal (~503 km)', () => {
    const toronto = { latitude: 43.65, longitude: -79.38 };
    const montreal = { latitude: 45.50, longitude: -73.57 };
    const distance = haversineDistance(toronto, montreal);
    expect(distance).toBeGreaterThan(498);
    expect(distance).toBeLessThan(508);
  });
});
```

This works because:
- The Toronto–Montreal distance is a known, verifiable value
- If the trigonometry or Earth's radius constant is wrong, the test fails

> "Never use the same algorithm in the oracle that you are using for the system under test."
> — [Test Oracle, Wikipedia](https://en.wikipedia.org/wiki/Test_oracle)

## Summary

Focus tests on:
- **Error handling** at system boundaries
- **Boundary values** where special handling is needed
- **Known values** to verify algorithm correctness

## Reference

- [Test Oracle - Wikipedia](https://en.wikipedia.org/wiki/Test_oracle)
- [Vitest Documentation](https://vitest.dev/)
