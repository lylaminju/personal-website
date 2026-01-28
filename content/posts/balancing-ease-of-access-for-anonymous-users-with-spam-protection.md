---
title: Balancing Ease of Access for Anonymous Users with Spam Protection
date: 2025-05-21
---

## The Problem

For my personal project, [**ClimberzDay**](https://climberz.day), I built a platform where users can join one-day events without needing to log in, prioritizing a frictionless experience. However, this open access posed a challenge: preventing spam and duplicate registrations while keeping the process simple. I needed a lightweight solution to deter repeat submissions from anonymous users, while staying compliant with Canada's PIPEDA privacy regulations.

## Considered Methods

I explored several approaches to prevent duplicate registrations:

### 1. IP Address Tracking

Store the user's IP address in the database and check for duplicates on a per-event basis.

**Pros**:
- Easy to implement

**Cons**:
- Shared IPs (e.g., public Wi-Fi) could block legitimate users
- Dynamic IPs change frequently
- IP addresses are considered personal information under PIPEDA, raising privacy concerns
- Can be easily bypassed using VPNs or proxies

### 2. Email-Based Deduplication

Require an email for registration and prevent duplicates based on email and event ID.

**Pros**:
- Reliable user identification, as emails are unique

**Cons**:
- Users can use multiple emails to bypass restrictions
- Email verification adds complexity and cost
- Less ideal for fully anonymous users

### 3. Client-Side UUID

Generate a unique identifier (UUID) in the browser, store it in `localStorage`, and check for duplicates per event.

**Pros**:
- Lightweight and non-intrusive, requiring no extra user input
- Simple to implement using `crypto.randomUUID()`
- Minimal privacy concerns, as UUIDs alone are not personally identifiable information (PII)

**Cons**:
- Users can bypass the check by clearing browser data or switching devices
- Requires careful handling to avoid SSR-related issues in SvelteKit

### 4. CAPTCHA

Add a CAPTCHA (e.g., reCAPTCHA) to block automated spam.

**Pros**:
- Effective against bots

**Cons**:
- Adds friction, potentially reducing registrations
- Doesn’t prevent manual duplicate submissions
- Requires third-party integration, increasing complexity

## Conclusion

I chose the **client-side UUID** approach. Here’s why:

- **Ease of Access**: UUIDs require no additional input, keeping registration seamless for anonymous users.
- **Simplicity**: The solution is lightweight, using `crypto.randomUUID()` and Supabase queries without additional dependencies.
- **PIPEDA Compliance**: I disclose UUID collection in my privacy policy as a "temporary ID" stored until 7 days after the event date, in line with data minimization principles.
- **Trade-offs Acknowledged**: For my small-scale project, strict enforcement isn’t critical. I accept that users could bypass the system by clearing their browser data. In such cases, I rely partly on user goodwill.

> 💡 **Is UUID the best method?**  
> UUIDs offer a lightweight deduplication mechanism, but they aren't highly reliable identifiers. They are vulnerable to manipulation and can’t fully prevent malicious repeat submissions while preserving anonymity.  
>
> Alternatives like combining cookies with server-side sessions or using browser fingerprinting (e.g., canvas or audio fingerprinting) might offer stronger enforcement, but the latter poses significant privacy and legal concerns, especially under PIPEDA.  
>
> In the context of a small-scale, low-risk service, the UUID approach remains a practical and privacy-conscious choice.

## Implementation Highlights

- **UUID Generation and Storage**: In my SvelteKit app, I generate a UUID using `crypto.randomUUID()` when a guest requests to join an event. This UUID is stored in `localStorage` as `climberzday_guest_uuid`. When the user submits a request to join, the UUID is included in the database entry in the `join_request` table’s `user_uuid` column, along with a `uuid_expiry` timestamp set to 7 days after the event date.

- **Duplicate Check**: I query the `join_request` table to check whether a `user_uuid` already exists for the given event’s `post_id`. If so, I disable the “Request to Join” button and display the message “Request sent”.

- **UI Feedback**: The disabled button gives users immediate feedback, maintaining a simple and intuitive experience.

> ⚠️ Note: Since this check is client-side, it’s possible for users to manipulate localStorage or make direct API calls. For production environments, duplicate checks should also be enforced server-side to ensure integrity.

This approach strikes a balance between accessibility and spam prevention—well-suited for a user-friendly, small-scale event platform like [ClimberzDay](https://climberz.day).
