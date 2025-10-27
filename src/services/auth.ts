
'use client';

import { signIn, signOut } from 'next-auth/react';
import type { SignUpFormValues, LoginFormValues } from '@/lib/validators';

export async function signUp(values: SignUpFormValues) {
    try {
        // Create user via API call to our backend
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
            return { user: null, error: data.error || 'Failed to create account' };
        }

        // After successful signup, sign in the user
        const result = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (result?.error) {
            return { user: null, error: 'Account created but login failed' };
        }

        return { user: data.user, error: null };
    } catch (error: any) {
        return { user: null, error: error.message || 'An unexpected error occurred' };
    }
}

export async function logIn(values: LoginFormValues) {
    try {
        const result = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (result?.error) {
            return { user: null, error: result.error };
        }

        return { user: result, error: null };
    } catch (error: any) {
        return { user: null, error: error.message };
    }
}

export async function logOut() {
    try {
        await signOut({ callbackUrl: '/' });
        return { error: null };
    } catch (error: any) {
        return { error: error.message };
    }
}
