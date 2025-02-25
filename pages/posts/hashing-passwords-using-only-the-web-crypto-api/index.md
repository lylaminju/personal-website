# Hashing passwords using only the Web Crypto API

## Background

While working on a project using Cloudflare Workers, I found that the well-known functions–bcrypt and Argon2–are not supported. So, my team agreed to utilize the Web Crypto API to hash passwords.

## Hashing

### 1. Generate a random salt

[Salting](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#salting) - A salt is a unique, randomly generated string that is added to each password as part of the hashing process

```js
const salt = crypto.getRandomValues(new Uint8Array(16));
```

### 2. Derive a key using PBKDF2 with the given password and salt

i. Convert the password string into a binary format (`Uint8Array`)
ii. Convert the binary data into a usable cryptographic key (of type `CryptoKey`)
iii. Use [PBKDF2](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2) with a given salt, iterations, and hash function to derive a secure key

```js
async function deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  // Encode the password as a buffer
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import the password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // Derive bits for key using PBKDF2-HMAC-SHA256
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 600000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  return new Uint8Array(derivedBits);
}
```

#### ref) MDN examples
[deriveBits() using PBKDF2](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveBits#pbkdf2)
[deriveKey() using PBKDF2](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_derive_aes_key_from_password)
*`deriveBits()` returns a raw hash value for verification, while `deriveKey()` generates a `CryptoKey` for encryption.

### 3. Encode the salt and derived key as Base64 for storage

```js
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derivedKey = await deriveKey(password, salt);

  // Encode salt and hash as Base64 and concatenate with ':'
  return `${toBase64(salt)}:${toBase64(derivedKey)}`;
}

function toBase64(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString('base64');
}

function fromBase64(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'base64'));
}
```

## Validation

1. Extract the salt and hash from the stored hashed password
2. Derive the key using the input password and extracted salt
3. Compare the derived key with the stored derived key using constant-time comparison

```js
async function validatePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
  // Split the stored string into salt and hash components
  const [saltBase64, hashBase64] = hashedPassword.split(':');
  if (!saltBase64 || !hashBase64) {
    throw new Error('Invalid hashed password format');
  }

  const salt = fromBase64(saltBase64);
  const storedKey = fromBase64(hashBase64);

  // Derive key using the input password and extracted salt
  const derivedKey = await deriveKey(inputPassword, salt);

  return isEqual(derivedKey, storedKey);
}
```

### Compare keys with Constant-Time Comparison

The comparison should take the same amount of time regardless of the input values, to prevent timing attacks.

❌ Regular comparison operations stop as soon as they detect a difference, allowing attackers to measure the time difference and infer where the values match or differ.
```js
function isEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (derivedKey.length !== storedDerivedKey.length) {
    return false;
  }
  // Compare byte by byte
  for (let i = 0; i < derivedKey.length; i++) {
    if (derivedKey[i] !== storedDerivedKey[i]) {
      return false;
    }
  }
}
```
✅ With constant-time comparison, even if an attacker measures the time taken to complete the comparison, they cannot deduce any information about the internal data.
```js
function isEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  // Compare each byte using XOR operation and accumulate the result
  for (let i = 0; i < a.length; i++) {
    result |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }

  // Return true if all bytes are equal (result remains 0)
  return result === 0;
}
```

#### ref
- [OWASP Cheat Sheet - Compare Password Hashes Using Safe Functions](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#compare-password-hashes-using-safe-functions)
- [Paragon Initiative Enterprises Blog - Preventing Timing Attacks on String Comparison with Double HMAC Strategy](https://paragonie.com/blog/2015/11/preventing-timing-attacks-on-string-comparison-with-double-hmac-strategy)
- [Chosen Plaintext Blog - Beginner's Guide to Constant-Time Cryptography](https://www.chosenplaintext.ca/articles/beginners-guide-constant-time-cryptography.html)

## Reference

- [MDN Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
