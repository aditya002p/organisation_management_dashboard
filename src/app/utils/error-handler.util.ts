export class ErrorHandler {
  static handleFirebaseError(error: any): string {
    if (!error || !error.code) return 'An unknown error occurred';

    switch (error.code) {
      case 'auth/user-not-found':
        return 'No user found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      default:
        return error.message || 'An error occurred';
    }
  }

  static handleHttpError(error: any): string {
    if (!error) return 'An unknown error occurred';

    if (error.status === 404) {
      return 'Resource not found';
    }

    if (error.status === 403) {
      return 'You do not have permission to perform this action';
    }

    if (error.status === 401) {
      return 'Please login to continue';
    }

    return error.message || 'A server error occurred';
  }
}
