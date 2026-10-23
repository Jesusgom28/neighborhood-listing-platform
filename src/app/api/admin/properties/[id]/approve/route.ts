
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publicKey || !secretKey) {
    return NextResponse.json(
      { error: "Database configuration is missing" },
      { status: 500 }
    );
  }

  // Require a valid user access token.
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const accessToken = match[1];

  const authClient = createClient(supabaseUrl, publicKey, {
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

  // Server-only privileged client.
  // Never expose this key to the browser.
  const adminClient = createClient(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  // Check the verified user's administrator status.
  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("is_admin")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Admin check failed:", profileError.message);

    return NextResponse.json(
      { error: "Unable to verify permissions" },
      { status: 500 }
    );
  }

  if (profile?.is_admin !== true) {
    return NextResponse.json(
      { error: "Administrator access required" },
      { status: 403 }
    );
  }

  // Only approve a property that is currently unapproved.
  const { data, error } = await adminClient
    .from("properties")
    .update({ is_approved: true })
    .eq("property_id", Number(id))
    .eq("is_approved", false)
    .select("property_id")
    .maybeSingle();

  if (error) {
    console.error("Property approval failed:", error.message);

    return NextResponse.json(
      { error: "Unable to approve property" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Unapproved property not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Property approved successfully",
    property_id: data.property_id,
  });
}
