
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowser();

      // Verify the user's credentials with Supabase Auth.
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        setError("Unable to sign in. Check your email and password.");
        return;
      }

      // Return to the homepage after successful login.
      router.push("/");
      router.refresh();
    } catch {
      setError("Login is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <Link href="/" className="underline">
        Back to listings
      </Link>

      <h1 className="mt-8 text-3xl font-bold">Sign in</h1>

      <p className="mt-2 text-gray-700">
        Sign in to submit inquiries about properties.
      </p>

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded border p-3"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded border p-3"
          />
        </div>

        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-700 p-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
