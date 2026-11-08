
import "server-only";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function getApprovedSponsorCopy(
  sponsorId: number
): Promise<string | null> {
  if (!Number.isSafeInteger(sponsorId) || sponsorId <= 0) {
    return null;
  }

  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from("sponsor_marketing_copy")
    .select("copy_text")
    .eq("sponsor_id", sponsorId)
    .eq("status", "APPROVED")
    .not("approved_by", "is", null)
    .not("approved_at", "is", null)
    .order("approved_at", { ascending: false })
    .order("copy_id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "Approved sponsor copy lookup failed:",
      error.message
    );
    return null;
  }

  if (!data) {
    return null;
  }

  const text = data.copy_text.trim();

  if (!text || text.length > 120) {
    return null;
  }

  return text;
}
