
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateProperty } from "@/lib/validateProperty";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Database configuration is missing" },
      { status: 500 }
    );
  }

  // Public, anonymous client. RLS remains active.
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("properties")
    .select(
      "property_id,address,price,bedrooms,bathrooms,square_feet,amenities,zip_code"
    )
    .eq("is_approved", true)
    .order("property_id", { ascending: true });

  if (error) {
    console.error("Property query failed:", error.message);

    return NextResponse.json(
      { error: "Unable to retrieve properties" },
      { status: 500 }
    );
  }

  return NextResponse.json({ properties: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Database configuration is missing" },
      { status: 500 }
    );
  }

  // Require an authenticated user.
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const accessToken = match[1];

  // Verify the token with Supabase Auth.
  const authClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: authData, error: authError } =
    await authClient.auth.getUser(accessToken);

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: "Invalid or expired authentication token" },
      { status: 401 }
    );
  }

  // Parse and validate the submitted JSON.
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  const validation = validateProperty(body);

  if (!validation.valid || !validation.data) {
    return NextResponse.json(
      {
        error: "Property validation failed",
        details: validation.errors,
      },
      { status: 400 }
    );
  }

  const property = validation.data;

  // Use the verified user's token for database requests.
  // Row Level Security remains enforced.
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase
    .from("properties")
    .insert({
      owner_id: authData.user.id,
      address: property.address,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      square_feet: property.square_feet,
      amenities: property.amenities,
      zip_code: property.zip_code,
    })
    .select("property_id")
    .single();

  if (error) {
    console.error("Property creation failed:", error.message);

    return NextResponse.json(
      { error: "Unable to create property" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "Property created successfully. Awaiting approval.",
      property_id: data.property_id,
    },
    { status: 201 }
  );
}
