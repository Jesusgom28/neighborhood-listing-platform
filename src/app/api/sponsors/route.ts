
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

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Use the UTC date for consistent campaign filtering.
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("sponsors")
    .select(
      "sponsor_id,business_name,description,website_url,tier,priority,placement,target_zip,start_date,end_date"
    )
    .eq("status", "APPROVED")
    .eq("is_active", true)
    .lte("start_date", today)
    .gte("end_date", today)
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
