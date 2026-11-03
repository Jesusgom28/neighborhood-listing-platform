
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { propertySchema } from "@/schemas/property";

const getConfig = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export async function GET() {
  const { url, key } = getConfig();

  if (!url || !key) {
    return NextResponse.json(
      { error: "Database configuration is missing" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("properties")
    .select("id,address,price,bedrooms,bathrooms,square_feet")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

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
  const { url, key } = getConfig();

  if (!url || !key) {
    return NextResponse.json(
      { error: "Database configuration is missing" },
      { status: 500 }
    );
  }

  const match = request.headers
    .get("authorization")
    ?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const accessToken = match[1];

  const authClient = createClient(url, key, {
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

  const validation = propertySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Property validation failed",
        details: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  // Use the authenticated user's token so RLS is enforced.
  const supabase = createClient(url, key, {
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
      ...validation.data,
      owner_id: authData.user.id,
      status: "draft",
    })
    .select("id")
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
      message: "Property draft created successfully",
      property_id: data.id,
    },
    { status: 201 }
  );
}
