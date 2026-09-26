import Image from "next/image";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border bg-white text-gray-900 shadow-sm">
      <Image
        src={property.imageUrl}
        alt={`${property.title} at ${property.address}, ${property.city}`}
        width={600}
        height={400}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <h2 className="text-xl font-semibold">{property.title}</h2>

        <address className="mt-1 not-italic text-gray-600">
          {property.address}, {property.city}
        </address>

        <p className="mt-2 text-lg font-bold">
          ${property.price.toLocaleString()}
        </p>

        <ul className="mt-2 flex gap-4 text-sm">
          <li>{property.bedrooms} bedrooms</li>
          <li>{property.bathrooms} bathrooms</li>
        </ul>

        <a
          href={`/properties/${property.id}`}
          className="mt-4 inline-block rounded bg-blue-700 px-4 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          View details for {property.title}
        </a>
      </div>
    </article>
  );
}