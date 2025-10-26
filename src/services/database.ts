"use client";

import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { ProfileFormValues } from "@/lib/validators";

type UserProfile = {
    displayName: string;
    email: string;
    photoURL?: string;
    bio?: string;
    tags?: string;
    socialHandle?: string;
    createdAt?: any;
    updatedAt?: any;
};

export async function createUserProfile(uid: string, data: Partial<UserProfile>) {
    try {
        const userProfileRef = doc(db, "users", uid);
        await setDoc(userProfileRef, {
            ...data,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error creating user profile: ", error);
        // You might want to handle this error more gracefully
    }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
        const userProfileRef = doc(db, "users", uid);
        const docSnap = await getDoc(userProfileRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile: ", error);
        return null;
    }
}

export async function updateUserProfileInDb(uid: string, data: ProfileFormValues) {
    try {
        const userProfileRef = doc(db, "users", uid);
        await updateDoc(userProfileRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating user profile: ", error);
        throw error;
    }
}
