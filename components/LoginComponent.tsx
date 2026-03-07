"use client";

import { createAuthClient } from "better-auth/client";
import { useState } from "react";

const authClient = createAuthClient();

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleGithub = async () => {
    setLoading(true);
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

  return (
   <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-amber-50 to-orange-100 px-4">
  <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
    
    {/* Logo / Icon */}
    <div className="mb-6 text-center">
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
        🍽️
      </div>
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome to Foodies
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Create an account to order your favorite meals
      </p>
    </div>

    {/* Buttons */}
    <div className="space-y-4">
      <button
        onClick={handleGoogle}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
      >
        <span>🔴</span>
        Continue with Google
      </button>

      <button
        onClick={handleGithub}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 font-medium text-white hover:bg-gray-800 transition disabled:opacity-50"
      >
        <span>🐙</span>
        Continue with GitHub
      </button>
    </div>

    {/* Divider */}
    <div className="my-6 flex items-center">
      <div className="flex-1 border-t"></div>
      <span className="px-3 text-sm text-gray-400">or</span>
      <div className="flex-1 border-t"></div>
    </div>

    {/* Extra Option */}
    <p className="text-center text-sm text-gray-500">
      Already have an account?{" "}
      <span className="cursor-pointer font-medium text-orange-600 hover:underline">
        Sign in
      </span>
    </p>
  </div>
</div>
  );
}