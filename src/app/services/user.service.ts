import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IUser } from '../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  getUser(userId: string): Observable<IUser> {
    return this.firestore.doc<IUser>(`users/${userId}`).valueChanges();
  }

  updateUser(userId: string, data: Partial<IUser>) {
    return this.firestore.doc(`users/${userId}`).update({
      ...data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  async deleteUser(userId: string) {
    const batch = this.firestore.firestore.batch();

    // Delete user document
    const userRef = this.firestore.doc(`users/${userId}`).ref;
    batch.delete(userRef);

    // Delete user's organization memberships
    const memberships = await this.firestore
      .collection('organizationMembers', (ref) =>
        ref.where('userId', '==', userId)
      )
      .get()
      .toPromise();

    memberships.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    return batch.commit();
  }

  searchUsers(searchTerm: string): Observable<IUser[]> {
    return this.firestore
      .collection<IUser>('users', (ref) =>
        ref
          .where('email', '>=', searchTerm)
          .where('email', '<=', searchTerm + '\uf8ff')
          .limit(10)
      )
      .valueChanges();
  }
}
