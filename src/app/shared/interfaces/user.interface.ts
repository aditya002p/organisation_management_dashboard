export interface IUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}
