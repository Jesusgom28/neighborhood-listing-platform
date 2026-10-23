
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import SponsorPlacement from "@/components/SponsorPlacement";
import SponsorImpressionTracker from "@/components/SponsorImpressionTracker";
import {
  selectSponsor,
  type SponsorCandidate,
} from "@/lib/selectSponsor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    notFound();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Database configuration is missing");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select(
      "property_id,address,price,bedrooms,bathrooms,square_feet,zip_code"
    )
    .eq("property_id", Number(id))
    .eq("is_approved", true)
    .maybeSingle();

  if (propertyError) {
    throw new Error("Unable to retrieve property");
  }

  if (!property) {
    notFound();
  }

  const today = new Date().toISOString().slice(0, 10);
  const placement = "PROPERTY_DETAIL";

  const { data: sponsors, error: sponsorError } = await supabase
    .from("sponsors")
    .select(
      "sponsor_id,business_name,website_url,status,is_active,tier,priority,placement,target_zip,start_date,end_date"
    )
    .eq("status", "APPROVED")
    .eq("is_active", true)
    .eq("placement", placement)
    .eq("target_zip", property.zip_code)
    .lte("start_date", today)
    .gte("end_date", today);

  if (sponsorError) {
    throw new Error("Unable to retrieve sponsors");
  }

  const selectedSponsor = selectSponsor(
    {
      zipCode: property.zip_code,
      placement,
      today,
    },
    (sponsors ?? []) as SponsorCandidate[]
  );

  const address = property.address as {
    street?: string;
    city?: string;
    state?: string;
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link href="/" className="underline">
        Back to listings
      </Link>

      <h1 className="mt-6 text-3xl font-bold">
        Property #{property.property_id}
      </h1>

      <p className="mt-3">
        {address.street}, {address.city}, {address.state}{" "}
        {property.zip_code}
      </p>

      <p className="mt-4 text-2xl font-semibold">
        ${Number(property.price).toLocaleString("en-US")}
      </p>

      <div className="mt-4 flex flex-wrap gap-4">
        <span>{property.bedrooms} bedrooms</span>
        <span>{property.bathrooms} bathrooms</span>
        <span>{property.square_feet} sq. ft.</span>
      </div>

      <section className="mt-10" aria-label="Local sponsor">
        {selectedSponsor ? (
          <SponsorImpressionTracker propertyId={property.property_id}>
            <SponsorPlacement sponsor={selectedSponsor} />
          </SponsorImpressionTracker>
        ) : (
          <SponsorPlacement sponsor={null} />
        )}
      </section>
    </main>
  );
}
