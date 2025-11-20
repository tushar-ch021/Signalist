'use server';

import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";



export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry

}: SignUpFormData) => {
    try {
        console.log('signUpWithEmail: called', { email, fullName, country, investmentGoals, riskTolerance, preferredIndustry });
        const response = await auth.api.signUpEmail({
            body: { email, password, name: fullName }
        })
        // If signup succeeded, response should be truthy. Send onboarding event and return success.
        if (response) {
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry,
                },
            });
            return { success: true, data: response };
        }

        // If we reached here, response was falsy - treat as failure
        console.log('signUpWithEmail: empty response from auth.api.signUpEmail', { email, fullName });
        const msg = 'Empty response from auth.api.signUpEmail';
        console.error('signUpWithEmail:', msg, { email, fullName });
        throw new Error(msg);
    } catch (error: unknown) {
        console.error('signUpWithEmail: exception', error);
        const msg = (error as { body?: { message?: string }; message?: string })?.body?.message || (error as { message?: string })?.message || '';
        if (msg.toLowerCase().includes('exist') || msg.toLowerCase().includes('duplicate')) {
            throw new Error('User already exists');
        }
        // Re-throw to allow the client-side to show the error via try/catch
        throw error;
    }
}
export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        console.log('signInWithEmail: called', { email });
        const response = await auth.api.signInEmail({
            body: { email, password }
        })

        return { success: true, data: response };
    }

    catch (error) {
        console.error('signInWithEmail failed: exception', error);
        // Re-throw to allow the client-side to show the error via try/catch
        throw error;
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({
            headers: await headers()
        })
    } catch {
        console.log('signout failed')
        return { success: false }
    }
}
