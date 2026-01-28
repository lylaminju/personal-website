---
title: Ensuring data integrity in SvelteKit + Supabase
date: 2025-05-22
---

# Ensuring Data Integrity in SvelteKit + Supabase: PostgreSQL Triggers vs Client-Side Transactions

In modern web development, ensuring data integrity across related database tables is a critical challenge. For applications built with SvelteKit and Supabase, this often arises when synchronizing updates—for example, soft-deleting a user and their associated profile. In this post, I explore two approaches to manage such transactions: using a PostgreSQL trigger in Supabase versus handling multiple client-side queries with rollback logic in SvelteKit. I’ll compare their pros and cons, explain why I chose the trigger approach, and offer guidance for similar scenarios.

## The Challenge: Synchronizing Soft Deletes
In my SvelteKit application, I use Supabase for authentication and data storage.

- The `auth.users` table manages user authentication and includes a `deleted_at` column for soft deletion.
- The `public.profile` table stores user profiles, with a `profile_id` column referencing `auth.users.id` as a foreign key, and its own `deleted_at` column.

When I soft-delete a user (e.g., set `auth.users.deleted_at`), I also need to update `public.profile.deleted_at` to maintain consistency. A partial update—where `auth.users` is updated but `public.profile` is not—could lead to data inconsistencies and compromise data integrity.

Since Supabase’s client libraries don’t support multi-statement transactions over HTTP, I had two options:

- **PostgreSQL Trigger**: Automatically update `public.profile.deleted_at` whenever `auth.users.deleted_at` changes.
- **Client-Side Queries**: Perform both updates in SvelteKit and manually implement rollback logic if something fails.

This kind of decision is common in Supabase projects and reflects a broader trade-off: should you handle data integrity in the database or the application layer? Let’s compare both.

## Option 1: PostgreSQL Trigger
This approach uses a PostgreSQL function and trigger in Supabase to update `public.profile.deleted_at` whenever `auth.users.deleted_at` is modified. My SvelteKit code only updates `auth.users`, and the database handles the rest.

### Implementation
Here’s the SQL to create the trigger and function (run via Supabase SQL Editor):

```sql
-- Function to sync profile.deleted_at with auth.users.deleted_at
CREATE OR REPLACE FUNCTION public.sync_profile_deleted_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profile
  SET deleted_at = NEW.deleted_at
  WHERE profile_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to fire after auth.users.deleted_at updates
CREATE TRIGGER sync_profile_deleted_at_trigger
AFTER UPDATE OF deleted_at ON auth.users
FOR EACH ROW
WHEN (OLD.deleted_at IS DISTINCT FROM NEW.deleted_at)
EXECUTE FUNCTION public.sync_profile_deleted_at();
```

Since direct updates to `auth.users` require admin privileges, I use a SvelteKit server route that calls the Supabase Admin API:

```ts
// src/routes/profile/[username]/+server.ts
import { supabaseAdmin } from '$lib/supabaseClient';

export async function DELETE({ request }) {
  // ...

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId, true); // Soft-deletes the user

  // ...
}
```

And the client calls this server route:

```ts
// src/routes/profile/[username]/+page.svelte
async function handleDeleteProfile() {
  // ...

  const response = await fetch(`/profile/${profile.username}`, {
    method: 'DELETE',
    body: JSON.stringify({ userId }),
  });

  // ...
}
```

### Pros

- **Atomicity**: The trigger executes as part of the same transaction context, ensuring both tables stay in sync ([Supabase Triggers Guide](https://supabase.com/docs/guides/database/postgres/triggers)).
- **Simplified Client Code**: Only one server call is needed.
- **Centralized Logic**: Data consistency is enforced at the database level, regardless of the client.
- **Security**: Sensitive logic is moved out of the client and into the database, reducing the attack surface.
- **Performance**: Reduces network round-trips.

### Cons

- **Database Dependency**: Ties business logic to PostgreSQL, which can complicate migrations or debugging.
- **Supabase Limitations**: `auth.users` can only be modified via the Admin API or server-side logic.
- **Testing Complexity**: Triggers require SQL-based tests, and Supabase doesn’t yet offer full local emulation.

## Option 2: Client-Side Queries with Rollback
In this approach, I update both tables from a SvelteKit server route and implement rollback logic manually.

### Implementation

```ts
// src/routes/profile/[username]/+server.ts
import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/supabaseClient';

export async function DELETE({ request }) {
  // ...

  // Step 1: Update auth.users
  const { error: userError } = await supabaseAdmin
    .from('users')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', userId);

  if (userError) {
    return json({ error: `Failed to soft delete user: ${userError.message}` }, { status: 500 });
  }

  // Step 2: Update public.profile
  const { error: profileError } = await supabaseAdmin
    .from('profile')
    .update({ deleted_at: new Date().toISOString() })
    .eq('profile_id', userId);

  if (profileError) {
    // Rollback user deletion
    await supabaseAdmin
      .from('users')
      .update({ deleted_at: null })
      .eq('id', userId);

    return json({ error: `Failed to update profile: ${profileError.message}` }, { status: 500 });
  }

  return json({ success: true });
}
```

### Pros

- **Easier Debugging**: Errors are surfaced in JavaScript and easier to trace.
- **Database Simplicity**: Avoids custom SQL functions and triggers.
- **Database-Agnostic**: Doesn’t rely on PostgreSQL-specific features.
- **Testable in JS**: Works with tools like Vitest without needing database-level tests.

### Cons

- **Inconsistency Risk**: No transaction support across requests—failures can leave the DB in an inconsistent state ([Supabase Client API Limitations](https://supabase.com/docs/reference/javascript/supabase-client)).
- **More Complex Code**: Requires manual rollback logic.
- **Security Considerations**: Requires careful RLS and privilege control on both tables.
- **Lower Performance**: Multiple network calls and error handling paths add latency.
- **Duplicated Logic**: Logic must be duplicated across clients or services.

## Why I Chose PostgreSQL Triggers
I chose PostgreSQL triggers for the following reasons:

- **Guaranteed Consistency**: Updates happen atomically, ensuring `profile.deleted_at` always reflects `auth.users.deleted_at`.
- **Cleaner Code**: My SvelteKit server route stays simple, focusing only on the user deletion.
- **Security**: Critical logic is encapsulated within the database, reducing exposure to bugs or misuse.
- **Supabase Alignment**: Supabase supports and documents database-driven approaches like triggers, especially for auth-related operations.
- **Better Performance**: One round-trip and fewer failure points.

While the client-side approach offers flexibility, the risk of inconsistency and the complexity of manual rollback outweigh the benefits in my case. The trigger approach aligns better with Supabase’s database-first philosophy and gives me more confidence in data reliability.

## When to Use Client-Side Queries

Client-side transactions may be a better fit if:

- You need conditional logic or coordination with external services.
- Your team (or you) are more comfortable in JavaScript than SQL.
- You’re building a prototype and want to iterate without touching the database schema.

But for most production-level apps that require multi-table integrity, I’d recommend using triggers or stored procedures.

## Broader Applicability
This pattern isn’t limited to soft deletes. Any case where related records must stay in sync can benefit from this comparison:

- Updating order status and stock levels in an e-commerce app.
- Syncing user preferences and notification settings.
- Cascading updates or deletions across several tables.

Understanding when to rely on database triggers vs. application-level logic can help you make more robust architectural choices.

## Conclusion
Managing transactions in SvelteKit + Supabase involves trade-offs between consistency, security, and maintainability. PostgreSQL triggers offer a robust, atomic solution for synchronizing tables like `auth.users` and `public.profile`. In contrast, client-side logic gives you flexibility but introduces more complexity and potential for bugs.

For my app, triggers were the right choice—they simplified my code and strengthened data integrity. Whatever your stack or use case, I hope this comparison helps you think critically about where to put your transactional logic.
