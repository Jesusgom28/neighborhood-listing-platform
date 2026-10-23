
"use client";

import { useEffect, useRef } from "react";

type SponsorImpressionTrackerProps = {
  propertyId: number;
  children: React.ReactNode;
};

export default function SponsorImpressionTracker({
  propertyId,
  children,
}: SponsorImpressionTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let sent = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry || entry.intersectionRatio < 0.5 || sent) {
          return;
        }

        sent = true;
        observer.disconnect();

        fetch(`/api/properties/${propertyId}/impression`, {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
        }).catch((error) => {
          console.error("Sponsor impression failed:", error);
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [propertyId]);

  return <div ref={containerRef}>{children}</div>;
}
