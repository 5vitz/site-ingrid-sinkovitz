# Security Specification - Portfolio App

## Data Invariants
1. **Projects**: Must have a valid ID, title, and order. Only admins can create/update/delete. Public can read.
2. **Services**: Must have a title and a list of items. Only admins can modify. Public can read.
3. **Testimonials**: Must have author and text. Only admins can modify. Public can read.
4. **Settings**: Public can read global settings. Only admins can update.
5. **Users Roles**: Only 'super' admins can modify roles. Users can see their own role.

## The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Attempt to create a project with an arbitrary `id`.
2. **Privilege Escalation**: Attempt to set `role: 'super'` on a profile from a non-admin account.
3. **Ghost Field Update**: Attempt to add `isVerified: true` to a project.
4. **ID Poisoning**: Attempt to use `../poison` as a project ID.
5. **Resource Exhaustion**: Attempt to write a 1MB string into a service item.
6. **Orphaned Write**: Attempt to create a project with a non-existent category reference (if any).
7. **Terminal State Bypass**: Attempt to update a project marked as 'published' (if we had terminal locking).
8. **PII Leak**: Attempt to list all `users_roles` as a normal user.
9. **Update Gap**: Attempt to update ONLY the `order` of a project without providing the rest of the schema.
10. **Type Mismatch**: Attempt to write a boolean into the `title` field of a project.
11. **Verification Bypass**: Attempt to write as a user with an unverified email (if enforced).
12. **Recursive Cost Attack**: Attempt a list query that forces O(n) `get()` calls (though rules should prevent this).

## The Test Runner (Plan)
We will verify that:
- `allow read: if true` works for projects/services/testimonials.
- `allow write: if isAdmin()` works for authenticated admins.
- `allow write: if false` works for everyone else.

(Note: Actual `.test.ts` file would require a test environment, but we will simulate the logic in our rules.)
