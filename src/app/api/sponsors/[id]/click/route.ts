
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateSponsorUrl } from "@/lib/validateSponsorUrl";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // Accept only positive integer sponsor IDs.
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return NextResponse.json(
      { error: "Invalid sponsor ID" },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Database configuration is missing" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const today = new Date().toISOString().slice(0, 10);

  // Read the destination from the approved database record.
  // Never accept a destination URL from request parameters.
  const { data: sponsor, error } = await supabase
    .from("sponsors")
    .select("sponsor_id,website_url")
    .eq("sponsor_id", Number(id))
    .eq("status", "APPROVED")
    .eq("is_active", true)
    .lte("start_date", today)
    .gte("end_date", today)
    .maybeSingle();

  if (error) {
    console.error("Sponsor lookup failed:", error.message);
    return NextResponse.json(
      { error: "Unable to verify sponsor" },
      { status: 500 }
    );
  }

  if (!sponsor) {
    return NextResponse.json(
      { error: "Sponsor not found or not eligible" },
      { status: 404 }
    );
  }

  const validation = validateSponsorUrl(sponsor.website_url);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Sponsor destination is not permitted" },
      { status: 400 }
    );
  }

  // Explicit external redirect; no visitor-controlled destination.
  const response = NextResponse.redirect(validation.url, 302);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
