
import Image from "next/image";
import type { Sponsor } from "@/types";

interface SponsorBannerProps {
  sponsor: Sponsor;
}

export default function SponsorBanner({ sponsor }: SponsorBannerProps) {
  return (
    <aside className="overflow-hidden rounded-lg border bg-gray-50 text-gray-900">
      {sponsor.imageUrl && (
        <Image
          src={sponsor.imageUrl}
          alt={`Promotional banner for ${sponsor.name}`}
          width={1200}
          height={400}
          sizes="(max-width: 767px) 100vw, 768px"
          className="h-auto w-full object-cover"
        />
      )}

      <div className="p-4">
        <p className="text-sm font-semibold uppercase">Sponsored</p>

        <h2 className="mt-1 text-lg font-semibold">{sponsor.name}</h2>

        <p className="mt-1 text-gray-700">{sponsor.message}</p>

        <a
          href={sponsor.url}
          rel="sponsored nofollow"
          className="mt-3 inline-block rounded px-3 py-2 font-medium underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Visit {sponsor.name}
        </a>
      </div>
    </aside>
  );
}
