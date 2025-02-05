import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async emailSignUp(email: string, password: string) {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      return this.updateUserData(credential.user);
    } catch (error) {
      throw error;
    }
  }

  async emailSignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.signOut();
  }

  private updateUserData(user: any) {
    const userRef = this.firestore.doc(`users/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email,
      photoURL: user.photoURL,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    return userRef.set(data, { merge: true });
  }
  async updateProfile(data: { displayName: string }) {
    const user = await this.afAuth.currentUser;
    if (user) {
      await user.updateProfile({
        displayName: data.displayName,
      });

      // Update Firestore document as well
      return this.firestore.doc(`users/${user.uid}`).update({
        displayName: data.displayName,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    throw new Error('User not logged in');
  }
}
