import properties from "../../data/generated/properties.json";
import { validateProperty } from "./validateProperty";

console.log("Synthetic property validation results:\n");

properties.forEach((property, index) => {
  const result = validateProperty(property);

  if (result.valid) {
    console.log(`Property ${index + 1}: VALID`);
  } else {
    console.log(`Property ${index + 1}: INVALID`);
    console.log(result.errors);
  }
});