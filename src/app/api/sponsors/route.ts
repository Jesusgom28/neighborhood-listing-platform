
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Database configuration is missing" },
      { status: 500 }
    );
  }

  // Public client with Row Level Security enabled.
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("sponsors")
    .select(
      "sponsor_id,business_name,description,website_url"
    )
    .eq("is_active", true)
    .order("sponsor_id", { ascending: true });

  if (error) {
    console.error("Sponsor query failed:", error.message);

    return NextResponse.json(
      { error: "Unable to retrieve sponsors" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    sponsors: data ?? [],
  });
}
