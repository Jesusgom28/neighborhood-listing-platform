import PropertyCard from "@/components/PropertyCard";
import SearchFilters from "@/components/SearchFilters";
import SponsorBanner from "@/components/SponsorBanner";
import type { Property, Sponsor } from "@/types";
import { validateProperty } from "@/lib/validateProperty";
import generatedProperties from "../../data/generated/properties.json";

const properties: Property[] = generatedProperties.flatMap((record) => {
  const result = validateProperty(record);

  if (!result.valid) {
    console.error(
      `Property ${record.property_id ?? "unknown"} failed validation:`,
      result.errors
    );

    return [];
  }

  return [
    {
      id: record.property_id,
      title: `${record.bedrooms} Bedroom Home`,
      address: record.address.street,
      city: `${record.address.city}, ${record.address.state}`,
      price: record.price,
      bedrooms: record.bedrooms,
      bathrooms: record.bathrooms,
      imageUrl: "/house-1.svg",
    },
  ];
});

const sponsor: Sponsor = {
  id: 1,
  name: "Neighborhood Home Services",
  message: "Helping local residents with their home service needs.",
  url: "https://example.com",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <header>
        <h1 className="text-3xl font-bold">Neighborhood Listings</h1>
        <p className="mt-2 text-gray-300">
          Find a home in your neighborhood.
        </p>
      </header>

      <section className="mt-8">
        <SearchFilters />
      </section>

      <section className="mt-8" aria-labelledby="properties-heading">
        <h2 id="properties-heading" className="mb-4 text-2xl font-semibold">
          Available Properties
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SponsorBanner sponsor={sponsor} />
      </section>
    </main>
  );
}