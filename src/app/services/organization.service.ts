import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, forkJoin } from 'rxjs';
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
        return this.addMember(docRef.id, userId, 'owner');
      });
  }

  getOrganization(orgId: string): Observable<any> {
    return this.firestore.doc(`organizations/${orgId}`).valueChanges();
  }

  getOrganizationMembers(orgId: string): Observable<any[]> {
    return this.firestore
      .collection('organizationMembers', (ref) =>
        ref.where('organizationId', '==', orgId)
      )
      .valueChanges();
  }

  getUserOrganizations(userId: string): Observable<any[]> {
    return this.firestore
      .collection('organizationMembers', (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges()
      .pipe(
        map((memberships: any[]) => memberships.map((m) => m.organizationId)), // Extract organization IDs
        map((orgIds: string[]) =>
          orgIds.length
            ? combineLatest(
                orgIds.map((orgId) =>
                  this.firestore.doc(`organizations/${orgId}`).valueChanges()
                )
              )
            : []
        ),
        // Ensure the final Observable emits a valid array
        map((obs: Observable<any[]> | []) => (Array.isArray(obs) ? obs : []))
      );
  }

  getCurrentUserRole(orgId: string): Observable<string> {
    return this.firestore
      .collection('organizationMembers', (ref) =>
        ref
          .where('organizationId', '==', orgId)
          .where('userId', '==', firebase.auth().currentUser?.uid || '')
      )
      .valueChanges()
      .pipe(
        map((members: any[]) => (members.length > 0 ? members[0].role : ''))
      );
  }

  getMemberCount(orgId: string): Observable<number> {
    return this.firestore
      .collection('organizationMembers', (ref) =>
        ref.where('organizationId', '==', orgId)
      )
      .valueChanges()
      .pipe(map((members) => members.length));
  }

  isUserAdmin(orgId: string): Observable<boolean> {
    return this.getCurrentUserRole(orgId).pipe(map((role) => role === 'admin'));
  }

  isUserOwner(orgId: string): Observable<boolean> {
    return this.getCurrentUserRole(orgId).pipe(map((role) => role === 'owner'));
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

  addMemberByEmail(orgId: string, email: string, role: string) {
    const memberData = {
      organizationId: orgId,
      email,
      role,
      joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    return this.firestore.collection('organizationMembers').add(memberData);
  }

  updateMemberRole(orgId: string, memberId: string, newRole: string) {
    return this.firestore
      .collection('organizationMembers')
      .doc(memberId)
      .update({ role: newRole });
  }

  removeMember(orgId: string, memberId: string) {
    return this.firestore
      .collection('organizationMembers')
      .doc(memberId)
      .delete();
  }

  updateOrganization(orgId: string, data: any) {
    return this.firestore.doc(`organizations/${orgId}`).update({
      ...data,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  deleteOrganization(orgId: string) {
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
