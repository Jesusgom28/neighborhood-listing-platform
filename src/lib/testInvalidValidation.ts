import invalidProperties from "../../data/generated/invalid/invalid-properties.json";
import { validateProperty } from "./validateProperty";

console.log("Invalid property validation results:\n");

invalidProperties.forEach((property, index) => {
  const result = validateProperty(property);

  console.log(`Invalid Property ${index + 1}:`);

  if (result.valid) {
    console.log("UNEXPECTEDLY VALID");
  } else {
    console.log("REJECTED AS EXPECTED");

    result.errors?.forEach((error) => {
      console.log(`  ${error.instancePath || "/"}: ${error.message}`);
    });
  }

  console.log();
});