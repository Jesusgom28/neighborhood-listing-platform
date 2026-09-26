import type { Sponsor } from "@/types";

interface SponsorBannerProps {
  sponsor: Sponsor;
}

export default function SponsorBanner({ sponsor }: SponsorBannerProps) {
  return (
    <aside className="rounded-lg border bg-gray-50 p-4">
      <p className="text-sm font-semibold uppercase">Sponsored</p>

      <h2 className="mt-1 text-lg font-semibold">{sponsor.name}</h2>

      <p className="mt-1 text-gray-700">{sponsor.message}</p>

      <a
        href={sponsor.url}
        className="mt-3 inline-block rounded px-3 py-2 font-medium underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Visit {sponsor.name}
      </a>
    </aside>
  );
}