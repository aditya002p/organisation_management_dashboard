export interface Organization {
  id?: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: any;
  updatedAt: any;
}

export interface Member {
  id?: string;
  organizationId: string;
  userId?: string; // Made optional to match service definition
  email: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: any;
  status?: 'active' | 'pending';
}
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ProjectStats {
  title: string;
  subtitle: string;
  progress: number;
  color: string;
  timeRemaining: string;
}

export interface Activity {
  userName: string;
  description: string;
  time: string;
  userPhoto: string;
}
