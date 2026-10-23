
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return NextResponse.json(
      { error: "Invalid property ID" },
      { status: 400 }
    );
  }

  // Basic same-origin protection.
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;

  if (origin !== expectedOrigin) {
    return NextResponse.json(
      { error: "Request origin not permitted" },
      { status: 403 }
    );
  }

  try {
    const supabase = createSupabaseAdmin();

    // The database function independently verifies
    // the selected sponsor before recording anything.
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("property_id,zip_code")
      .eq("property_id", Number(id))
      .eq("is_approved", true)
      .maybeSingle();

    if (propertyError) {
      throw propertyError;
    }

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);

    const { data: sponsors, error: sponsorError } = await supabase
      .from("sponsors")
      .select("sponsor_id,tier,priority")
      .eq("status", "APPROVED")
      .eq("is_active", true)
      .eq("placement", "PROPERTY_DETAIL")
      .eq("target_zip", property.zip_code)
      .lte("start_date", today)
      .gte("end_date", today);

    if (sponsorError) {
      throw sponsorError;
    }

    const tierRank: Record<string, number> = {
      SILVER: 1,
      GOLD: 2,
      PLATINUM: 3,
    };

    const ranked = [...(sponsors ?? [])].sort(
      (a, b) =>
        (tierRank[b.tier] ?? 0) - (tierRank[a.tier] ?? 0) ||
        b.priority - a.priority ||
        a.sponsor_id - b.sponsor_id
    );

    const winner = ranked[0];

    if (!winner) {
      return NextResponse.json(
        { recorded: false, reason: "No eligible sponsor" }
      );
    }

    const { data: recorded, error: recordError } = await supabase.rpc(
      "record_sponsor_impression",
      {
        p_sponsor_id: winner.sponsor_id,
        p_property_id: Number(id),
        p_placement: "PROPERTY_DETAIL",
      }
    );

    if (recordError) {
      throw recordError;
    }

    return NextResponse.json(
      { recorded: recorded === true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Impression recording failed:", error);

    return NextResponse.json(
      { error: "Unable to record impression" },
      { status: 500 }
    );
  }
}
