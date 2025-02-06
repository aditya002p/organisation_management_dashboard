export interface Member {
  id?: string;
  organizationId: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  userId?: string;
  joinedAt: any;
}
