import PropertyCard from "@/components/PropertyCard";
import SearchFilters from "@/components/SearchFilters";
import SponsorBanner from "@/components/SponsorBanner";
import type { Property, Sponsor } from "@/types";

const properties: Property[] = [
  {
    id: 1,
    title: "Sunny Family Home",
    address: "124 Maple Street",
    city: "Los Angeles, CA",
    price: 650000,
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: "/house-1.svg",
  },
  {
    id: 2,
    title: "Modern City Home",
    address: "850 Grand Avenue",
    city: "Los Angeles, CA",
    price: 825000,
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: "/house-2.svg",
  },
  {
    id: 3,
    title: "Spacious Neighborhood Home",
    address: "441 Oak Drive",
    city: "Los Angeles, CA",
    price: 975000,
    bedrooms: 4,
    bathrooms: 3,
    imageUrl: "/house-3.svg",
  },
];

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