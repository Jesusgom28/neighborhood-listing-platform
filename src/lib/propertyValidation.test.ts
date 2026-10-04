import assert from "node:assert/strict";
import properties from "../../data/generated/properties.json";
import invalidProperties from "../../data/generated/invalid/invalid-properties.json";
import { validateProperty } from "./validateProperty";

console.log("Running property data contract tests...\n");

// Test all five valid seed records.
properties.forEach((property, index) => {
  const result = validateProperty(property);

  assert.equal(
    result.valid,
    true,
    `Valid property ${index + 1} should pass validation`
  );

  console.log(`PASS: Valid property ${index + 1}`);
});

// Required invalid case 1: missing property_id.
const missingId = validateProperty(invalidProperties[0]);

assert.equal(
  missingId.valid,
  false,
  "Property missing property_id should fail validation"
);

assert.ok(
  missingId.errors?.some(
    (error) =>
      error.keyword === "required" &&
      error.params.missingProperty === "property_id"
  ),
  "Missing ID should fail because property_id is required"
);

console.log("PASS: Missing property_id rejected");

// Required invalid case 2: negative price.
const negativePrice = validateProperty(invalidProperties[1]);

assert.equal(
  negativePrice.valid,
  false,
  "Property with negative price should fail validation"
);

assert.ok(
  negativePrice.errors?.some(
    (error) =>
      error.instancePath === "/price" &&
      error.keyword === "minimum"
  ),
  "Negative price should fail the minimum constraint"
);

console.log("PASS: Negative price rejected");

// Required invalid case 3: bad ZIP code.
const badZip = validateProperty(invalidProperties[2]);

assert.equal(
  badZip.valid,
  false,
  "Property with invalid ZIP should fail validation"
);

assert.ok(
  badZip.errors?.some(
    (error) =>
      error.instancePath === "/zip_code" &&
      error.keyword === "pattern"
  ),
  "Bad ZIP should fail the ZIP pattern"
);

console.log("PASS: Invalid ZIP rejected");

// Required invalid case 4: unknown field.
const unknownField = validateProperty(invalidProperties[3]);

assert.equal(
  unknownField.valid,
  false,
  "Property containing an unknown field should fail validation"
);

assert.ok(
  unknownField.errors?.some(
    (error) => error.keyword === "additionalProperties"
  ),
  "Unknown field should fail additionalProperties"
);

console.log("PASS: Unknown property field rejected");

console.log("\nAll property data contract tests passed.");