
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateProperty } from "@/lib/validateProperty";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Database configuration is missing" },
      { status: 500 }
    );
  }

  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const accessToken = match[1];

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

  // All database operations use the verified user's JWT.
  // Supabase Row Level Security remains active.
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

  // Confirm the property belongs to this user and is a draft.
  const { data: existing, error: lookupError } = await supabase
    .from("properties")
    .select("property_id")
    .eq("property_id", Number(id))
    .eq("owner_id", authData.user.id)
    .eq("is_approved", false)
    .maybeSingle();

  if (lookupError) {
    console.error("Property lookup failed:", lookupError.message);

    return NextResponse.json(
      { error: "Unable to retrieve property" },
      { status: 500 }
    );
  }

  if (!existing) {
    return NextResponse.json(
      { error: "Editable property not found" },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from("properties")
    .update({
      address: property.address,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      square_feet: property.square_feet,
      amenities: property.amenities,
      zip_code: property.zip_code,
    })
    .eq("property_id", Number(id))
    .eq("owner_id", authData.user.id)
    .eq("is_approved", false)
    .select("property_id")
    .maybeSingle();

  if (error) {
    console.error("Property update failed:", error.message);

    return NextResponse.json(
      { error: "Unable to update property" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Editable property not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Property updated successfully",
    property_id: data.property_id,
  });
}
