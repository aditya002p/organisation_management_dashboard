export interface Organization {
  id?: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  id?: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  email?: string;
  joinedAt: Date;
}
