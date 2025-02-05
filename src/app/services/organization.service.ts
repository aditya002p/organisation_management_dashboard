import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Organization, Member } from '../shared/types/index';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase/compat/app';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  constructor(
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar
  ) {}

  createOrganization(
    data: Partial<Organization>,
    userId: string
  ): Promise<string> {
    const orgData = {
      ...data,
      ownerId: userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    return new Promise((resolve, reject) => {
      this.firestore
        .collection('organizations')
        .add(orgData)
        .then(async (docRef) => {
          await this.addMember(docRef.id, userId, 'owner');
          resolve(docRef.id);
        })
        .catch((error) => {
          this.snackBar.open('Error creating organization', 'Close', {
            duration: 5000,
          });
          reject(error);
        });
    });
  }

  getOrganization(orgId: string): Observable<Organization> {
    return this.firestore
      .doc<Organization>(`organizations/${orgId}`)
      .valueChanges();
  }

  getUserOrganizations(userId: string): Observable<Organization[]> {
    return this.firestore
      .collection<Member>('organizationMembers', (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges()
      .pipe(
        map((memberships) => memberships.map((m) => m.organizationId)),
        switchMap((orgIds) => {
          if (orgIds.length === 0) return [];
          const orgObservables = orgIds.map((id) =>
            this.firestore
              .doc<Organization>(`organizations/${id}`)
              .valueChanges()
          );
          return combineLatest(orgObservables);
        })
      );
  }

  getCurrentUserRole(orgId: string): Observable<string> {
    return this.firestore
      .collection<Member>('organizationMembers', (ref) =>
        ref
          .where('organizationId', '==', orgId)
          .where('userId', '==', firebase.auth().currentUser?.uid || '')
      )
      .valueChanges()
      .pipe(map((members) => (members.length > 0 ? members[0].role : '')));
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
