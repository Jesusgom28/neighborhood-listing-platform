
export type SponsorTier = "SILVER" | "GOLD" | "PLATINUM";

export interface SponsorCandidate {
  sponsor_id: number;
  business_name: string;
  tier: SponsorTier;
  priority: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  is_active: boolean;
  placement: string;
  target_zip: string;
  start_date: string;
  end_date: string;
  website_url: string;
}

export interface SponsorContext {
  zipCode: string;
  placement: string;
  today: string; // YYYY-MM-DD, injected for deterministic tests
}

const tierRank: Record<SponsorTier, number> = {
  SILVER: 1,
  GOLD: 2,
  PLATINUM: 3,
};

export function selectSponsor(
  context: SponsorContext,
  candidates: SponsorCandidate[]
): SponsorCandidate | null {
  const eligible = candidates.filter((sponsor) => {
    return (
      sponsor.status === "APPROVED" &&
      sponsor.is_active &&
      sponsor.placement === context.placement &&
      sponsor.target_zip === context.zipCode &&
      sponsor.start_date <= context.today &&
      sponsor.end_date >= context.today
    );
  });

  eligible.sort((a, b) => {
    return (
      tierRank[b.tier] - tierRank[a.tier] ||
      b.priority - a.priority ||
      a.sponsor_id - b.sponsor_id
    );
  });

  return eligible[0] ?? null;
}
