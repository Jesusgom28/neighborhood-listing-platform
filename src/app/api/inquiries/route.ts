
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Database configuration is missing" },
      { status: 500 }
    );
  }

  // Require a valid authentication token.
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

  // Parse JSON safely.
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  // Only accept the fields required to create an inquiry.
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      { error: "Inquiry must be a JSON object" },
      { status: 400 }
    );
  }

  const input = body as Record<string, unknown>;

  if (
    Object.keys(input).some(
      (key) => key !== "property_id" && key !== "message"
    )
  ) {
    return NextResponse.json(
      { error: "Unexpected inquiry fields" },
      { status: 400 }
    );
  }

  if (
    typeof input.property_id !== "number" ||
    !Number.isSafeInteger(input.property_id) ||
    input.property_id < 1
  ) {
    return NextResponse.json(
      { error: "A valid property_id is required" },
      { status: 400 }
    );
  }

  if (
    typeof input.message !== "string" ||
    input.message.trim().length === 0 ||
    input.message.length > 2000
  ) {
    return NextResponse.json(
      { error: "Message must contain 1 to 2000 characters" },
      { status: 400 }
    );
  }

  // Use the authenticated user's token for database operations.
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

  // Inquiries can only be sent about approved properties.
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("property_id")
    .eq("property_id", input.property_id)
    .eq("is_approved", true)
    .maybeSingle();

  if (propertyError) {
    console.error("Property lookup failed:", propertyError.message);

    return NextResponse.json(
      { error: "Unable to verify property" },
      { status: 500 }
    );
  }

  if (!property) {
    return NextResponse.json(
      { error: "Approved property not found" },
      { status: 404 }
    );
  }

  // sender_id is always derived from the verified user.
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      property_id: input.property_id,
      sender_id: authData.user.id,
      message: input.message.trim(),
    })
    .select("inquiry_id")
    .single();

  if (error) {
    console.error("Inquiry creation failed:", error.message);

    return NextResponse.json(
      { error: "Unable to create inquiry" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "Inquiry submitted successfully",
      inquiry_id: data.inquiry_id,
    },
    { status: 201 }
  );
}
