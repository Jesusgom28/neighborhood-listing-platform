
import type { SponsorCandidate } from "@/lib/selectSponsor";

interface SponsorPlacementProps {
  sponsor: SponsorCandidate | null;
}

export default function SponsorPlacement({
  sponsor,
}: SponsorPlacementProps) {
  if (!sponsor) {
    return (
      <aside
        aria-label="Community information"
        className="rounded-lg border p-4"
      >
        <h2 className="font-semibold">
          Explore Your Neighborhood
        </h2>
        <p className="mt-2 text-sm">
          Discover local businesses and community
          resources near your next home.
        </p>
      </aside>
    );
  }

  const disclosureId = `sponsor-disclosure-${sponsor.sponsor_id}`;

  return (
    <aside
      aria-label="Sponsored advertisement"
      className="rounded-lg border p-4"
    >
      <p
        id={disclosureId}
        className="mb-2 text-sm font-semibold"
      >
        Sponsored Partner
      </p>

      <h2 className="text-lg font-semibold">
        {sponsor.business_name}
      </h2>

      <a
        href={`/api/sponsors/${sponsor.sponsor_id}/click`}
        aria-describedby={disclosureId}
        className="mt-3 inline-block underline"
        rel="sponsored nofollow"
      >
        Visit sponsor website
      </a>
    </aside>
  );
}
