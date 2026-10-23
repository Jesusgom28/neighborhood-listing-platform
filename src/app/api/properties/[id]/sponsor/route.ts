
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  selectSponsor,
  type SponsorCandidate,
} from "@/lib/selectSponsor";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return NextResponse.json(
      { error: "Invalid property ID" },
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

  // Only approved properties are publicly eligible.
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("property_id,zip_code")
    .eq("property_id", Number(id))
    .eq("is_approved", true)
    .maybeSingle();

  if (propertyError) {
    console.error("Property lookup failed:", propertyError.message);
    return NextResponse.json(
      { error: "Unable to retrieve property" },
      { status: 500 }
    );
  }

  if (!property) {
    return NextResponse.json(
      { error: "Property not found" },
      { status: 404 }
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const placement = "PROPERTY_DETAIL";

  // Fetch only eligible sponsors for this ZIP and placement.
  const { data: sponsors, error: sponsorError } = await supabase
    .from("sponsors")
    .select(
      "sponsor_id,business_name,website_url,status,is_active,tier,priority,placement,target_zip,start_date,end_date"
    )
    .eq("status", "APPROVED")
    .eq("is_active", true)
    .eq("placement", placement)
    .eq("target_zip", property.zip_code)
    .lte("start_date", today)
    .gte("end_date", today);

  if (sponsorError) {
    console.error("Sponsor selection failed:", sponsorError.message);
    return NextResponse.json(
      { error: "Unable to retrieve sponsors" },
      { status: 500 }
    );
  }

  // The selector uses tier, priority, then sponsor ID
  // to choose exactly one deterministic winner.
  const selected = selectSponsor(
    {
      zipCode: property.zip_code,
      placement,
      today,
    },
    (sponsors ?? []) as SponsorCandidate[]
  );

  return NextResponse.json(
    {
      property_id: property.property_id,
      placement,
      sponsor: selected,
    },
    {
      headers: { "Cache-Control": "no-store" },
    }
  );
}
