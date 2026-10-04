import Ajv2020 from "ajv/dist/2020";
import propertySchema from "../../schema/property.schema.json";

const ajv = new Ajv2020({ allErrors: true });

const validate = ajv.compile(propertySchema);

export function validateProperty(data: unknown) {
  const valid = validate(data);

  if (!valid) {
    return {
      valid: false,
      errors: validate.errors,
    };
  }

  return {
    valid: true,
    errors: null,
  };
}