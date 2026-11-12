
"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

type InquiryFormProps = {
  propertyId: number;
};

export default function InquiryForm({ propertyId }: InquiryFormProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowser();

      // Retrieve the authenticated user's current access token.
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setStatus("Please sign in before sending an inquiry.");
        return;
      }

      // Send the inquiry to our protected API endpoint.
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({
          property_id: propertyId,
          message,
        }),
      });

      if (response.status === 401) {
        setStatus("Your session has expired. Please sign in again.");
        return;
      }

      if (!response.ok) {
        setStatus("Unable to send your inquiry. Please try again.");
        return;
      }

      // Clear the form only after successful submission.
      setMessage("");
      setStatus("Inquiry submitted successfully!");
    } catch {
      setStatus("Unable to send your inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10" aria-labelledby="inquiry-heading">
      <h2 id="inquiry-heading" className="text-2xl font-bold">
        Contact about this property
      </h2>

      <p className="mt-2 text-gray-700">
        Have a question? Send an inquiry to the property owner.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="inquiry-message" className="block font-medium">
            Your message
          </label>
          <textarea
            id="inquiry-message"
            required
            maxLength={2000}
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="mt-1 w-full rounded border p-3"
            placeholder="I'm interested in this property..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-700 px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send inquiry"}
        </button>

        {status && (
          <p role="status" aria-live="polite">
            {status}
          </p>
        )}
      </form>

      <p className="mt-4 text-sm">
        Need to sign in?{" "}
        <Link href="/login" className="text-blue-700 underline">
          Go to login
        </Link>
      </p>
    </section>
  );
}
