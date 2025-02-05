export interface Member {
  id?: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
}
