"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams){
    const { uid, name, email } = params;

    try {
        const userRecords = await db.collection('users').doc(uid).get();

        if(userRecords.exists) {
            return {
                success: false,
                message: "User already exists. Please try logging in."
            }
        }

        await db.collection('users').doc(uid).set({
            name,email,
        });

        return {
            sucess: true,
            message: "Account created successfully! Please sign in.",
        }

    } catch (e: unknown) {
        console.log('Error creating a user', e);

        interface FirebaseError {
            code: string;
            [key: string]: unknown;
        }

        if (typeof e === "object" && e !== null && "code" in e && (e as FirebaseError).code === "auth/email-already-exists") {
            return {
                success: false,
                message: "Email already exists. Please try another email."
            }
        }

        return {
            success: false,
            message: "An error occurred while creating the user. Please try again later."
        }
    }
}

export async function signIn(params: SignInParams){
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord) {
            return {
                success: false,
                message: "User not found. Please sign up first."
            }
        }

        await setSessionCookie(idToken);
    } catch (e) {
        console.log(e)

        return{
            sucess: false,
            message: "Failed to sign in. Please try again later."
        }
    }
}

export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000, // 5 days)
    })

    cookieStore.set('session', sessionCookie,{
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',        
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if( !userRecord.exists) return null;

        return {
            ... userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    return !!user;
};