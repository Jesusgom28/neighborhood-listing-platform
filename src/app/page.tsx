import PropertyCard from "@/components/PropertyCard";
import SearchFilters from "@/components/SearchFilters";
import SponsorBanner from "@/components/SponsorBanner";
import type { Property, Sponsor } from "@/types";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import NoPropertiesMessage from "@/components/NoPropertiesMessage";
import DatabaseErrorMessage from "@/components/DatabaseErrorMessage";

export const dynamic = "force-dynamic";

type DatabaseProperty = {
  property_id: number;
  address:
    | {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
      }
    | string
    | null;
  price: number | string;
  bedrooms: number;
  bathrooms: number;
};

type PropertyFilters = {
  bedrooms?: number;
  maxPrice?: number;
};

type HomeProps = {
  searchParams: Promise<{
    bedrooms?: string | string[];
    maxPrice?: string | string[];
  }>;
};

const sponsor: Sponsor = {
  id: 1,
  name: "Neighborhood Home Services",
  message: "Helping local residents with their home service needs.",
  url: "https://example.com",
};

async function getProperties(filters: PropertyFilters): Promise<{
  properties: Property[];
  error: boolean;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase configuration");
    return { properties: [], error: true };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  let query = supabase
    .from("properties")
    .select("property_id,address,price,bedrooms,bathrooms")
    .eq("is_approved", true);

  if (filters.bedrooms !== undefined) {
    query = query.gte("bedrooms", filters.bedrooms);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }

  const { data, error } = await query.order("property_id", {
    ascending: true,
  });

  if (error) {
    console.error("Unable to retrieve properties:", error.message);
    return { properties: [], error: true };
  }

  const properties: Property[] = ((data ?? []) as DatabaseProperty[]).map(
    (item) => {
      const address =
        typeof item.address === "string"
          ? { street: item.address }
          : (item.address ?? {});

      const city = [address.city ?? "Los Angeles", address.state ?? "CA"].join(
        ", ",
      );

      return {
        id: item.property_id,
        title: `Property #${item.property_id}`,
        address: address.street ?? "Address unavailable",
        city,
        price: Number(item.price),
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        imageUrl: `/house-${((item.property_id - 1) % 3) + 1}.svg`,
      };
    },
  );

  return { properties, error: false };
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const bedroomsValue =
    typeof params.bedrooms === "string" ? params.bedrooms : "";

  const maxPriceValue =
    typeof params.maxPrice === "string" ? params.maxPrice : "";

  const allowedBedrooms = ["1", "2", "3"];
  const allowedPrices = ["500000", "750000", "1000000"];

  const invalidFilters =
    (params.bedrooms !== undefined &&
      (typeof params.bedrooms !== "string" ||
        (params.bedrooms !== "" &&
          !allowedBedrooms.includes(params.bedrooms)))) ||
    (params.maxPrice !== undefined &&
      (typeof params.maxPrice !== "string" ||
        (params.maxPrice !== "" && !allowedPrices.includes(params.maxPrice))));

  const filters: PropertyFilters = {
    bedrooms: bedroomsValue ? Number(bedroomsValue) : undefined,
    maxPrice: maxPriceValue ? Number(maxPriceValue) : undefined,
  };

  const { properties, error } = invalidFilters
    ? { properties: [] as Property[], error: false }
    : await getProperties(filters);

  return (
    <main className="mx-auto max-w-7xl p-6">
      <header>
        <div className="flex items-center gap-3">
          <Image
            src="/home-icon.svg"
            alt=""
            width={48}
            height={48}
            className="h-10 w-10 shrink-0"
          />

          <h1 className="text-3xl font-bold">Neighborhood Listings</h1>
        </div>

        <p className="mt-2 text-gray-700">
          Find a home in your neighborhood.
        </p>
      </header>

      <section className="mt-8">
        <SearchFilters bedrooms={bedroomsValue} maxPrice={maxPriceValue} />
      </section>

      <section className="mt-8" aria-labelledby="properties-heading">
        <h2 id="properties-heading" className="mb-4 text-2xl font-semibold">
          Available Properties
        </h2>
        {error ? (
          <DatabaseErrorMessage />
        ) : invalidFilters ? (
          <p role="alert" className="rounded-lg border p-4">
            Invalid search filters. Please select valid options.
          </p>
        ) : properties.length === 0 ? (
          <NoPropertiesMessage />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <SponsorBanner sponsor={sponsor} />
      </section>
    </main>
  );
}
