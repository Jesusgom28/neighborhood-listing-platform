import { validateProperty } from "./validateProperty";

const typeMismatchPayload: unknown = {
  property_id: 201,
  address: {
    street: "123 Fictional Street",
    city: "Los Angeles",
    state: "CA"
  },
  price: "650000",
  bedrooms: 3,
  bathrooms: 2,
  square_feet: 1500,
  amenities: ["garage"],
  zip_code: "90001",
  local_sponsors: [1]
};

const businessRulePayload: unknown = {
  property_id: 202,
  address: {
    street: "456 Fictional Avenue",
    city: "Los Angeles",
    state: "CA"
  },
  price: -450000,
  bedrooms: 3,
  bathrooms: 2,
  square_feet: 1500,
  amenities: ["garage"],
  zip_code: "90001",
  local_sponsors: [1]
};

function processExternalProperty(data: unknown) {
  const result = validateProperty(data);

  if (!result.valid) {
    console.log("REJECTED AT APPLICATION BOUNDARY");

    result.errors?.forEach((error) => {
      console.log(
        `  ${error.instancePath || "/"}: ${error.message}`
      );
    });

    return;
  }

  console.log("VALID: safe to continue processing.");
}

console.log("Example A - Type Mismatch");
processExternalProperty(typeMismatchPayload);

console.log("\nExample B - Business Rule Violation");
processExternalProperty(businessRulePayload);