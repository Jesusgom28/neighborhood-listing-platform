import type { Property } from "../types";

const apiResponse: unknown = {
  id: 201,
  title: "Synthetic Test Property",
  address: "123 Fictional Street",
  city: "Los Angeles",
  price: "650000",
  bedrooms: 3,
  bathrooms: 2,
  imageUrl: "/house.jpg"
};

// Unsafe assertion: TypeScript trusts us without validating the runtime data.
const property = apiResponse as Property;

console.log("Property price:", property.price.toFixed(2));