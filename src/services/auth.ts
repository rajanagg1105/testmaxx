import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

// Admin email - change this to your email
const ADMIN_EMAIL = 'admin@testmaxx.com';

export const createAdminAccount = async (email: string, password: string, displayName: string) => {
  try {
    // Create the user account
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;
    
    // Update the user's display name
    await updateProfile(firebaseUser, {
      displayName: displayName
    });

    // Create user document in Firestore with admin role
    const newUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: displayName,
      role: 'admin', // Set as admin
      createdAt: new Date()
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    return newUser;
  } catch (error: any) {
    console.error('Admin account creation error:', error);
    throw new Error(error.message || 'Failed to create admin account');
  }
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      throw new Error('User data not found. Please contact support.');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

export const registerUser = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;
    
    // Update the user's display name
    await updateProfile(firebaseUser, {
      displayName: displayName
    });

    // Determine role based on email
    const role = email === ADMIN_EMAIL ? 'admin' : 'student';

    // Create user document in Firestore
    const newUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: displayName,
      role: role,
      createdAt: new Date()
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    return newUser;
  } catch (error: any) {
    console.error('Registration error:', error);
    let errorMessage = 'Registration failed';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    }
    
    throw new Error(errorMessage);
  }
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};