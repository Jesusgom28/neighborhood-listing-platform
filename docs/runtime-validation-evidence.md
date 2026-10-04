# Runtime Validation Evidence

## Conceptual Distinction

A TypeScript type or interface only checks types during development and compilation. TypeScript uses type erasure, which means interfaces and type information are removed when the code is compiled to JavaScript. Because of this, TypeScript cannot guarantee that external data, such as an API response or JSON payload, actually matches the expected interface at runtime.

Runtime validation checks the actual data while the application is running. This project uses AJV with a JSON Schema to validate external property data before the application uses it.


## Project Interface

The following interface is taken directly from `src/types/index.ts` in the capstone repository:

```typescript
export interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
}



There's one intentional distinction here: your **existing Week 2 `Property` interface** uses fields such as `id`, `title`, and `imageUrl`, while our new data contract uses `property_id`, structured `address`, `square_feet`, etc. We'll reconcile that later rather than pretending they're already identical.

Save the file with **Ctrl + S**.

Once that's done, tell me **ready**. Then we'll make the **unsafe `as Property` assertion** and deliberately demonstrate why TypeScript can compile something that still crashes at runtime.


## Unsafe Assertion and Example A

External data can be asserted as a `Property` without runtime validation:

```typescript
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

const property = apiResponse as Property;

console.log("Property price:", property.price.toFixed(2));
```

The assertion compiles because TypeScript trusts the developer's `as Property` assertion. However, `price` is actually a string at runtime.

Running the code produced:

```text
TypeError: property.price.toFixed is not a function
```

This demonstrates that a TypeScript assertion does not validate external data.


## Example B - Business Invariant Violation

The second payload uses the correct TypeScript primitive types, but contains a negative property price:

```typescript
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

const property = apiResponse as Property;
```

TypeScript accepts `-450000` because it is a valid number. Without runtime validation, the application accepted the record and produced:

```text
Price saved to database: $-450000
```

This demonstrates that compile-time type checking does not enforce domain or business rules.

## Boundary Defense

External data is validated with AJV before the application is allowed to process it:

```typescript
function processExternalProperty(data: unknown) {
  const result = validateProperty(data);

  if (!result.valid) {
    console.log("REJECTED AT APPLICATION BOUNDARY");

    result.errors?.forEach((error) => {
      console.log(
        `${error.instancePath || "/"}: ${error.message}`
      );
    });

    return;
  }

  console.log("VALID: safe to continue processing.");
}
```

Testing the two faulty payloads produced:

```text
Example A - Type Mismatch
REJECTED AT APPLICATION BOUNDARY
  /price: must be number

Example B - Business Rule Violation
REJECTED AT APPLICATION BOUNDARY
  /price: must be >= 0
```

The validator therefore prevents both a runtime type mismatch and a domain constraint violation before the application continues processing the external data.