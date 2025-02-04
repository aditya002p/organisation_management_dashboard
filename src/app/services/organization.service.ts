import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private firestore: AngularFirestore) {}

  createOrganization(data: any, userId: string) {
    const orgData = {
      ...data,
      ownerId: userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    return this.firestore
      .collection('organizations')
      .add(orgData)
      .then((docRef) => {
        // Add owner as first member
        return this.addMember(docRef.id, userId, 'owner');
      });
  }

  getUserOrganizations(userId: string): Observable<any[]> {
    return this.firestore
      .collection('organizationMembers', (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges()
      .pipe(
        map((memberships) => {
          const orgIds = memberships.map((m: any) => m.organizationId);
          return combineLatest(
            orgIds.map((orgId) =>
              this.firestore.doc(`organizations/${orgId}`).valueChanges()
            )
          );
        })
      );
  }

  addMember(orgId: string, userId: string, role: string) {
    const memberData = {
      organizationId: orgId,
      userId,
      role,
      joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    return this.firestore.collection('organizationMembers').add(memberData);
  }

  updateOrganization(orgId: string, data: any) {
    return this.firestore.doc(`organizations/${orgId}`).update({
      ...data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  deleteOrganization(orgId: string) {
    // Delete organization and all its members
    return this.firestore
      .doc(`organizations/${orgId}`)
      .delete()
      .then(() => {
        return this.firestore
          .collection('organizationMembers', (ref) =>
            ref.where('organizationId', '==', orgId)
          )
          .get()
          .toPromise()
          .then((snapshot) => {
            snapshot.forEach((doc) => doc.ref.delete());
          });
      });
  }
}
