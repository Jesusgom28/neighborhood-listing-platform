import geminiProperties from "../../data/generated/gemini-properties.json";
import { validateProperty } from "./validateProperty";

console.log("Gemini generated property validation results:\n");

let allValid = true;

geminiProperties.forEach((property, index) => {
  const result = validateProperty(property);

  if (result.valid) {
    console.log(`Gemini Property ${index + 1}: VALID`);
  } else {
    allValid = false;

    console.log(`Gemini Property ${index + 1}: INVALID`);

    result.errors?.forEach((error) => {
      console.log(
        `  ${error.instancePath || "/"}: ${error.message}`
      );
    });
  }
});

console.log();

if (allValid) {
  console.log("All Gemini generated records passed local AJV validation.");
} else {
  console.log("One or more Gemini generated records failed validation.");
}