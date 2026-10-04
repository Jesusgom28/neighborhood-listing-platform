import type { Property } from "../types";

const apiResponse: unknown = {
  id: 202,
  title: "Synthetic Negative Price Property",
  address: "456 Fictional Avenue",
  city: "Los Angeles",
  price: -450000,
  bedrooms: 3,
  bathrooms: 2,
  imageUrl: "/house2.jpg"
};

// This assertion compiles because every primitive type matches Property.
const property = apiResponse as Property;

console.log("Property accepted without runtime validation:");
console.log(property);

console.log(`Price saved to database: $${property.price}`);