# Security Specification

## 1. Data Invariants
- Admin Email: Only authenticated user with email `singhriya53225@gmail.com` and `email_verified == true` can write, update, or delete portfolio content.
- Public Read: Any visitor (authenticated or unauthenticated) can read portfolio collections (`profile`, `skills`, `projects`, `education`, `trainings`, `certifications`) where `published == true` (or profile document where `published == true`). Non-published documents can only be read by the Admin.
- Messages: Any visitor can create a contact inquiry under `/messages/{messageId}` provided name, email, and message conform to size limits. Only Admin can read, list, update, or delete messages.
- No client-side impersonation: No user can escalate privileges or write documents under portfolio collections without being verified as Riya Singh (`singhriya53225@gmail.com`).

## 2. Dirty Dozen Security Payloads
1. Unauthorized Project Create: Anonymous user attempts to create `/projects/p999` with `{ title: "Hacked" }` -> DENIED.
2. Unverified Email Admin Write: Authenticated user with email `singhriya53225@gmail.com` but `email_verified: false` attempts update -> DENIED.
3. Impersonator Email Write: Authenticated user with email `attacker@evil.com` attempts to update `/profile/main` -> DENIED.
4. Unbounded Payload / Denial-of-Wallet: Creating project with 50MB string description -> DENIED by length check.
5. Path Traversal / Poisoned ID: Accessing `/projects/../../secret` with invalid characters -> DENIED by `isValidId`.
6. Reading Unpublished Drafts as Public: Visitor querying `/projects` where `published == false` -> DENIED.
7. Reading Private Messages: Non-admin user querying `/messages` -> DENIED.
8. Deleting Profile: Non-admin user sending delete to `/profile/main` -> DENIED.
9. Malformed Message Injection: Public user submitting message with missing email or > 3000 chars -> DENIED.
10. Modifying Existing Message: Public user attempting to edit a submitted message -> DENIED.
11. Ghost Fields Injection in Project: Attacker injecting unexpected root fields `{ adminBackdoor: true }` -> DENIED.
12. Admin Role Spoofing in Client Token: Client sending fake token claim `{ role: "admin" }` -> DENIED because rule enforces server token email.
