import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthError, Session } from "@supabase/supabase-js";
import { Supabase } from "../supabaseclient";


type AuthActionResult<T> =
    | { success: true; data: T }
    | { success: false; error: AuthError };

type AuthContextValue = {
    session: Session | null;
    SignUpNewUser: (email: string, password: string) => Promise<AuthActionResult<Awaited<ReturnType<typeof Supabase.auth.signUp>>["data"]>>;
    SignInUser: (email: string, password: string) => Promise<AuthActionResult<Awaited<ReturnType<typeof Supabase.auth.signInWithPassword>>["data"]>>;
    SignOut: () => Promise<AuthActionResult<null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        let isMounted = true;

        Supabase.auth.getSession().then(({ data }) => {
            if (isMounted) {
                setSession(data.session ?? null);
            }
        });

        const {
            data: { subscription },
        } = Supabase.auth.onAuthStateChange((_event, nextSession) => {
            if (isMounted) {
                setSession(nextSession ?? null);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const SignUpNewUser = async (email: string, password: string): Promise<AuthActionResult<Awaited<ReturnType<typeof Supabase.auth.signUp>>["data"]>> => {
        const { data, error } = await Supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error("There was a problem signing up:", error.message);
            return {
                success: false,
                error,
            };
        }

        return {
            success: true,
            data,
        };
    };

    const SignInUser = async (email: string, password: string): Promise<AuthActionResult<Awaited<ReturnType<typeof Supabase.auth.signInWithPassword>>["data"]>> => {
        const { data, error } = await Supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("There was a problem signing in:", error.message);
            return {
                success: false,
                error,
            };
        }

        return {
            success: true,
            data,
        };
    };

    const SignOut = async (): Promise<AuthActionResult<null>> => {
        const { error } = await Supabase.auth.signOut();

        if (error) {
            console.error("There was a problem signing out:", error.message);
            return {
                success: false,
                error,
            };
        }

        return {
            success: true,
            data: null,
        };
    };

    return (
        <AuthContext.Provider value={{ session, SignUpNewUser, SignInUser, SignOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("UserAuth must be used within an AuthContextProvider");
    }

    return context;
};