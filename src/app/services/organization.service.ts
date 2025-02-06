import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase/compat/app';

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
  userId?: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: any;
  status?: 'active' | 'pending';
}

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
      .valueChanges()
      .pipe(
        map(
          (org) =>
            ({
              ...org,
              id: orgId,
            } as Organization)
        )
      );
  }

  // New method to get organization members
  getOrganizationMembers(orgId: string): Observable<Member[]> {
    return this.firestore
      .collection<Member>('organizationMembers', (ref) =>
        ref.where('organizationId', '==', orgId)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...a.payload.doc.data(),
              } as Member)
          )
        ),
        catchError((error) => {
          this.snackBar.open('Error fetching members', 'Close', {
            duration: 5000,
          });
          return of([]);
        })
      );
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
          if (orgIds.length === 0) return of([]);
          const orgObservables = orgIds.map((id) =>
            this.firestore
              .doc<Organization>(`organizations/${id}`)
              .valueChanges()
              .pipe(
                map(
                  (org) =>
                    ({
                      ...org,
                      id,
                    } as Organization)
                )
              )
          );
          return combineLatest(orgObservables);
        })
      );
  }

  getCurrentUserRole(orgId: string): Observable<string> {
    const currentUserId = firebase.auth().currentUser?.uid;
    if (!currentUserId) return of('');

    return this.firestore
      .collection<Member>('organizationMembers', (ref) =>
        ref
          .where('organizationId', '==', orgId)
          .where('userId', '==', currentUserId)
      )
      .valueChanges()
      .pipe(
        map((members) => (members.length > 0 ? members[0].role : '')),
        catchError(() => of(''))
      );
  }

  getMemberCount(orgId: string): Observable<number> {
    return this.firestore
      .collection<Member>('organizationMembers', (ref) =>
        ref.where('organizationId', '==', orgId)
      )
      .valueChanges()
      .pipe(
        map((members) => members.length),
        catchError(() => of(0))
      );
  }

  isUserAdmin(orgId: string): Observable<boolean> {
    return this.getCurrentUserRole(orgId).pipe(
      map((role) => role === 'admin' || role === 'owner')
    );
  }

  isUserOwner(orgId: string): Observable<boolean> {
    return this.getCurrentUserRole(orgId).pipe(map((role) => role === 'owner'));
  }

  addMember(orgId: string, userId: string, role: string): Promise<void> {
    const memberData: Partial<Member> = {
      organizationId: orgId,
      userId,
      role: role as Member['role'],
      joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'active',
    };

    return this.firestore
      .collection('organizationMembers')
      .add(memberData)
      .then(() => {
        this.snackBar.open('Member added successfully', 'Close', {
          duration: 3000,
        });
      })
      .catch((error) => {
        this.snackBar.open('Error adding member', 'Close', {
          duration: 5000,
        });
        throw error;
      });
  }

  addMemberByEmail(orgId: string, email: string, role: string): Promise<void> {
    const memberData: Partial<Member> = {
      organizationId: orgId,
      email,
      role: role as Member['role'],
      joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
    };

    return this.firestore
      .collection('organizationMembers')
      .add(memberData)
      .then(() => {
        this.snackBar.open('Invitation sent successfully', 'Close', {
          duration: 3000,
        });
      })
      .catch((error) => {
        this.snackBar.open('Error sending invitation', 'Close', {
          duration: 5000,
        });
        throw error;
      });
  }

  updateMemberRole(
    orgId: string,
    memberId: string,
    newRole: string
  ): Promise<void> {
    return this.firestore
      .collection('organizationMembers')
      .doc(memberId)
      .update({
        role: newRole,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        this.snackBar.open('Role updated successfully', 'Close', {
          duration: 3000,
        });
      })
      .catch((error) => {
        this.snackBar.open('Error updating role', 'Close', {
          duration: 5000,
        });
        throw error;
      });
  }

  removeMember(orgId: string, memberId: string): Promise<void> {
    return this.firestore
      .collection('organizationMembers')
      .doc(memberId)
      .delete()
      .then(() => {
        this.snackBar.open('Member removed successfully', 'Close', {
          duration: 3000,
        });
      })
      .catch((error) => {
        this.snackBar.open('Error removing member', 'Close', {
          duration: 5000,
        });
        throw error;
      });
  }

  updateOrganization(
    orgId: string,
    data: Partial<Organization>
  ): Promise<void> {
    return this.firestore
      .doc(`organizations/${orgId}`)
      .update({
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        this.snackBar.open('Organization updated successfully', 'Close', {
          duration: 3000,
        });
      })
      .catch((error) => {
        this.snackBar.open('Error updating organization', 'Close', {
          duration: 5000,
        });
        throw error;
      });
  }

  deleteOrganization(orgId: string): Promise<void> {
    return this.firestore
      .doc(`organizations/${orgId}`)
      .delete()
      .then(async () => {
        const snapshot = await this.firestore
          .collection('organizationMembers', (ref) =>
            ref.where('organizationId', '==', orgId)
          )
          .get()
          .toPromise();

        const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
        await Promise.all(deletePromises);

        this.snackBar.open('Organization deleted successfully', 'Close', {
          duration: 3000,
        });
      })
      .catch((error) => {
        this.snackBar.open('Error deleting organization', 'Close', {
          duration: 5000,
        });
        throw error;
      });
  }
}
