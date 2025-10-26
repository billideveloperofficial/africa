
'use client';

import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile,
    type User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { SignUpFormValues, LoginFormValues, ProfileFormValues } from '@/lib/validators';
import { createUserProfile, updateUserProfileInDb } from './database';

export async function signUp(values: SignUpFormValues) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        await updateProfile(userCredential.user, {
            displayName: values.username,
        });

        let profileData: any = {
            displayName: values.username,
            email: values.email,
        };

        // If creating the test user, pre-fill with sample data
        if (values.email === 'test@example.com') {
            profileData = {
                ...profileData,
                bio: "This is a test bio for the pre-filled test user. I enjoy creating content and testing new features!",
                tags: "testing, development, sample-profile",
                socialHandle: "https://twitter.com/testuser",
                photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
            };
        }

        // Create a user profile in Firestore
        await createUserProfile(userCredential.user.uid, profileData);
        
        // Also update the auth profile with photo if available
        if (profileData.photoURL) {
            await updateProfile(userCredential.user, {
                photoURL: profileData.photoURL
            });
        }

        return { user: userCredential.user, error: null };
    } catch (error: any) {
        // If test user already exists, just sign them in.
        if (error.code === 'auth/email-already-in-use' && values.email === 'test@example.com') {
            return logIn({ email: values.email, password: values.password });
        }
        return { user: null, error: error.message };
    }
}

export async function logIn(values: LoginFormValues) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        return { user: userCredential.user, error: null };
    } catch (error: any) {
        return { user: null, error: error.message };
    }
}

export async function logOut() {
    try {
        await signOut(auth);
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

export async function updateUserProfile(values: ProfileFormValues) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No user is signed in.");
        }
        // Update Firebase Auth profile
        await updateProfile(user, {
            displayName: values.displayName,
            photoURL: values.photoURL,
        });
        
        // Update user profile in Firestore
        await updateUserProfileInDb(user.uid, values);

        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}
