# Security Specification — JK Vaastu Firestore Rules

## 1. Data Invariants
1. **Default-Deny Baseline**: Every path not explicitly matched is denied (`allow read, write: if false`).
2. **PII Isolation**: `/appointments/{appointmentId}` and `/inquiries/{inquiryId}` contain client emails, phone numbers, and birth dates. Blanket reads and unauthenticated reads are strictly forbidden. Only verified admins (or the verified creator matching `resource.data.userId == request.auth.uid`) may read their own records.
3. **Public Editorial Scoping**: `/blogs`, `/videos`, and `/testimonials` allow public reads ONLY when `resource.data.status == 'published'`. Draft entries are visible exclusively to verified admins.
4. **Admin Integrity & Anti-Spoofing**: Admin privileges require `request.auth != null && request.auth.token.email_verified == true` AND either the bootstrapped admin email (`uanusha017@gmail.com`) or a matching UID in `/admins/{uid}`. Clients can never self-assign admin status.
5. **Immutable Audit Fields & Server Timestamps**: `createdAt` must equal `request.time` on create and remain strictly equal to `resource.data.createdAt` on update. `updatedAt` must equal `request.time` on every create and update.
6. **Terminal State Protection**: Appointments in terminal states (`completed`, `cancelled`) cannot be modified by non-admins; only verified admins may override or correct appointment records.
7. **Volumetric & Key Hardening**: Every string field has explicit `.size()` bounds matching `firebase-blueprint.json`. Document IDs match `^[a-zA-Z0-9_\-]+$` with max length 128. Shadow/ghost fields are blocked via `hasOnly()`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Shadow Field Injection on Appointment Create**: Adding `isAdmin: true` or `verified: true` to `/appointments/{id}`. -> Must return `PERMISSION_DENIED`.
2. **Status Pre-Approval Spoofing on Booking**: Public/user creating an appointment with `status: "confirmed"` instead of `"pending"`. -> Must return `PERMISSION_DENIED`.
3. **Unverified Admin Email Spoofing**: Authenticated user with email `uanusha017@gmail.com` where `email_verified: false` attempting to list `/appointments`. -> Must return `PERMISSION_DENIED`.
4. **Cross-User PII Leak**: Authenticated non-admin user attempting `get` or `list` on another user's `/appointments/{otherId}` or `/inquiries/{otherId}`. -> Must return `PERMISSION_DENIED`.
5. **Client Timestamp Forgery**: Creating a blog post or appointment with a backdated client timestamp (`createdAt != request.time`). -> Must return `PERMISSION_DENIED`.
6. **ID Poisoning Attack**: Creating a document with a 500-character or invalid-character ID (`../../admin`). -> Must return `PERMISSION_DENIED`.
7. **Denial-of-Wallet Oversized String**: Submitting a 200KB string in `notes` or `title` exceeding blueprint `maxLength`. -> Must return `PERMISSION_DENIED`.
8. **Draft Blog Scraping**: Unauthenticated visitor attempting `get` or `list` on `/blogs` with `status: "draft"`. -> Must return `PERMISSION_DENIED`.
9. **Unauthorized Blog Mutation**: Regular signed-in user attempting to create, update, or delete a document in `/blogs`, `/videos`, `/testimonials`, or `/siteSettings`. -> Must return `PERMISSION_DENIED`.
10. **Self-Admin Privilege Escalation**: Regular signed-in user attempting to write `/admins/{theirUid}`. -> Must return `PERMISSION_DENIED`.
11. **Immutable `createdAt` Tampering**: Admin updating an appointment while modifying `createdAt` or `userId`. -> Must return `PERMISSION_DENIED`.
12. **Value Poisoning on Whitelisted Update Field**: Updating `rating` in `/testimonials` to a string `"five"` or number `99`, or `status` to `"hacked"`. -> Must return `PERMISSION_DENIED`.
