// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { User } from '../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        console.log('Auth State Changed:', user); // Check this
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }

  async emailSignUp(email: string, password: string): Promise<void> {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (credential.user) {
        await this.updateUserData(credential.user);
        this.snackBar.open('Account created successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      this.snackBar.open(error.message, 'Close', { duration: 5000 });
      throw error;
    }
  }

  async emailSignIn(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.snackBar.open('Welcome back!', 'Close', { duration: 5000 });
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.snackBar.open(error.message, 'Close', { duration: 5000 });
      throw error;
    }
  }

  async googleSignIn(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.signInWithPopup(provider);

      if (credential.user) {
        await this.updateUserData(credential.user);
        this.snackBar.open('Google Sign-In Successful!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      this.snackBar.open(error.message, 'Close', { duration: 5000 });
      throw error;
    }
  }
  async updateUserData(updates: Partial<User>): Promise<void> {
    try {
      const user = await this.afAuth.currentUser;
      if (!user) throw new Error('No authenticated user');

      const userRef = this.firestore.doc(`users/${user.uid}`);
      const updateData = {
        ...updates,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await userRef.update(updateData);
      this.snackBar.open('Profile updated successfully!', 'Close', {
        duration: 3000,
      });
    } catch (error: any) {
      this.snackBar.open(error.message, 'Close', { duration: 5000 });
      throw error;
    }
  }
  async signOut(): Promise<void> {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }
}
