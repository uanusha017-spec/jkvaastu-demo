/**
 * Verification suite specification for JK Vaastu Firestore Security Rules.
 * Validates all 12 adversarial payloads from security_spec.md return PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expected: 'PERMISSION_DENIED';
}

export const dirtyDozenPayloads: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on Appointment Create',
    collection: 'appointments/appt_shadow_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'client@example.com', email_verified: true },
    payload: {
      fullName: 'Test Client',
      email: 'client@example.com',
      phone: '+91 9876543210',
      birthDate: '1990-05-10',
      city: 'Bengaluru',
      propertyType: 'Owned Home',
      serviceCategory: 'Vastu for House',
      preferredDate: '2026-12-01',
      preferredSlot: 'Morning (09:30 - 12:30)',
      consultationMode: 'Online Video',
      notes: 'Checking shadow field',
      status: 'pending',
      adminNotes: '',
      userId: 'user_1',
      isAdmin: true
    },
    expected: 'PERMISSION_DENIED'
  },
  {
    id: 2,
    name: 'Status Pre-Approval Spoofing on Booking',
    collection: 'appointments/appt_spoof_2',
    operation: 'create',
    auth: { uid: 'user_1', email: 'client@example.com', email_verified: true },
    payload: {
      fullName: 'Test Client',
      email: 'client@example.com',
      phone: '+91 9876543210',
      birthDate: '1990-05-10',
      city: 'Bengaluru',
      propertyType: 'Owned Home',
      serviceCategory: 'Vastu for House',
      preferredDate: '2026-12-01',
      preferredSlot: 'Morning (09:30 - 12:30)',
      consultationMode: 'Online Video',
      notes: '',
      status: 'confirmed',
      adminNotes: '',
      userId: 'user_1'
    },
    expected: 'PERMISSION_DENIED'
  },
  {
    id: 3,
    name: 'Unverified Admin Email Spoofing',
    collection: 'appointments',
    operation: 'list',
    auth: { uid: 'spoof_uid', email: 'uanusha017@gmail.com', email_verified: false },
    expected: 'PERMISSION_DENIED'
  },
  {
    id: 4,
    name: 'Cross-User PII Leak on Appointments',
    collection: 'appointments/other_user_appt',
    operation: 'get',
    auth: { uid: 'user_2', email: 'other@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED'
  },
  {
    id: 5,
    name: 'Client Timestamp Forgery',
    collection: 'blogs/blog_forged_time',
    operation: 'create',
    auth: { uid: 'admin_1', email: 'uanusha017@gmail.com', email_verified: true },
    payload: {
      title: 'Forged Timestamp Post',
      slug: 'forged-timestamp-post',
      category: 'Home Vastu',
      excerpt: 'Testing backdated client timestamp rejection.',
      content: 'This post supplies a forged client createdAt instead of serverTimestamp().',
      coverImage: '/jkvaastu/blog-energy.png',
      author: 'Jaydevji',
      readTime: '4 min read',
      status: 'published',
      featured: false,
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-01T00:00:00Z'
    },
    expected: 'PERMISSION_DENIED'
  },
  {
    id: 6,
    name: 'ID Poisoning Attack',
    collection: 'appointments/' + 'a'.repeat(200),
    operation: 'create',
    auth: { uid: 'user_1', email: 'client@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED'
  },
  {
    id: 7,
    name: 'Denial-of-Wallet Oversized String',
    collection: 'inquiries/inq_oversized',
    operation: 'create',
    auth: null,
    payload: {
      fullName: 'Spammer',
      email: 'spam@example.com',
      phone: '+91 9000000000',
      subject: 'Flood',
      message: 'x'.repeat(5000),
      status: 'new',
      userId: 'guest'
    },
    expected: 'PERMISSION_DENIED'
  },
  {
    id: 8,
    name: 'Draft Blog Scraping',
    collection: 'blogs/internal_draft',
    operation: 'get',
    auth: null,
    expected: 'PERMISSION_DENIED'
  },
  {
    id: 9,
    name: 'Unauthorized Blog Mutation',
    collection: 'blogs/hacked_blog',
    operation: 'create',
    auth: { uid: 'user_1', email: 'client@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED'
  },
  {
    id: 10,
    name: 'Self-Admin Privilege Escalation',
    collection: 'admins/user_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'client@example.com', email_verified: true },
    payload: { email: 'client@example.com', displayName: 'Attacker', role: 'admin' },
    expected: 'PERMISSION_DENIED'
  },
  {
    id: 11,
    name: 'Immutable createdAt Tampering',
    collection: 'appointments/appt_existing',
    operation: 'update',
    auth: { uid: 'admin_1', email: 'uanusha017@gmail.com', email_verified: true },
    payload: { createdAt: '1999-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED'
  },
  {
    id: 12,
    name: 'Value Poisoning on Whitelisted Update Field',
    collection: 'testimonials/test_1',
    operation: 'update',
    auth: { uid: 'admin_1', email: 'uanusha017@gmail.com', email_verified: true },
    payload: { rating: 99, status: 'hacked' },
    expected: 'PERMISSION_DENIED'
  }
];
