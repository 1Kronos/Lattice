

import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

export default function Home() {
    const { session, SignOut } = UserAuth();

    const handleSignOut = async () => {
        await SignOut();
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-4xl rounded border bg-white p-8 shadow-sm">
                <p className="text-sm uppercase tracking-wide text-blue-600">Crommbook</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome to your home page</h1>
                <p className="mt-3 text-slate-600">
                    {session
                        ? `You’re signed in as ${session.user.email ?? "your account"}.`
                        : "Sign in to access your notes and account settings."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    {session ? (
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="rounded bg-slate-900 px-4 py-2 text-white"
                        >
                            Sign out
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded bg-blue-600 px-4 py-2 text-white"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/signup"
                                className="rounded border px-4 py-2 text-slate-700"
                            >
                                Create account
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}