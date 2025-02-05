interface Organization {
  id?: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
}
