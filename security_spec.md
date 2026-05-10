# Security Specification - HR Flow

## 1. Data Invariants
- An Admin record can only be created by an existing Admin (or initial bootstrap).
- Organization Requests can be created by anyone, but only edited by Admins.
- Organizations can only be created/edited by Admins.
- Users (HR) can only see their own organization data.
- Employees can only be managed by HR accounts belonging to the same organization.
- Attendance can only be marked by HR accounts belonging to the same organization.
- Date IDs must match format YYYY-MM-DD.

## 2. The Dirty Dozen Payloads
1. **Admin Spoofing**: Attempt to create an `admins` record without being an admin.
2. **Organization Hijack**: HR attempting to change the `organizationId` or `hrId` of an organization.
3. **Cross-Org Employee Read**: HR from Org A trying to list employees of Org B.
4. **Attendance Forgery**: HR marking attendance for an employee not in their organization.
5. **Request Status Modification**: Public user trying to approve their own organization request.
6. **User Role Elevation**: HR trying to change their role to `super_admin`.
7. **Identity Theft**: User trying to update another user's email or organization association.
8. **Orphaned Employee**: Creating an employee with a non-existent `organizationId`.
9. **Timestamp Manipulation**: Manually setting `createdAt` to a past date instead of server time.
10. **ID Poisoning**: Injecting a 2MB string as a document ID.
11. **Shadow Update**: Adding a `isSystemAdmin: true` field to an HR profile.
12. **PII Leak**: Unauthorized user trying to read the `users` collection filtered by email.

## 3. The Test Runner
(This will be verified via the drafted rules)
