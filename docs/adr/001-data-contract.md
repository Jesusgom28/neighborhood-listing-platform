# ADR 001: Property Data Contract

## Status

Accepted

## Context

The neighborhood listing platform needs a consistent way to represent property data received from external sources. TypeScript interfaces provide compile-time type checking, but they do not validate data at runtime because TypeScript types are erased when the application is compiled to JavaScript.

External data may contain missing fields, incorrect types, unexpected fields, or values that violate business rules. Examples include a missing property ID, a negative property price, or an invalid ZIP code.

The application therefore needs a runtime data contract that can reject malformed property data before it reaches the user interface or database.

## Decision

The project will use JSON Schema Draft 2020-12 as the runtime data contract for property listings.

AJV will validate external property data against the schema before the application processes it.

The schema requires:

- A positive `property_id`
- Structured street, city, and state address fields
- A nonnegative price
- Nonnegative bedroom and bathroom counts
- Nonnegative square footage
- A five-digit ZIP code
- An amenities array
- A list of local sponsor IDs
- No unknown property fields

The schema uses `additionalProperties: false` to prevent unexpected fields from entering the application.

## Relationships

The data model separates three concepts:

**Property**

Represents a property listing. Its primary key is `property_id`.

**Sponsor**

Represents a local business that may sponsor listings. Its primary key is `sponsor_id`.

**PropertySponsor**

Represents the relationship between properties and sponsors.

A property may have multiple sponsors, and a sponsor may appear on multiple properties. This creates a many-to-many relationship between Property and Sponsor.

For the current JSON representation, `local_sponsors` stores sponsor IDs rather than duplicating complete Sponsor objects inside each property.

## Amenities Decision

Amenities will currently be represented as an array of controlled string values.

Examples include:

- `garage`
- `pool`
- `backyard`
- `balcony`
- `air conditioning`
- `solar panels`

Free-text amenities were considered but rejected because variations such as `Pool`, `pool`, and `swimming pool` could represent the same concept and make searching or filtering inconsistent.

A separate amenities table and join table would provide stronger normalization for a larger production database, but it adds unnecessary complexity for the current capstone prototype.

## Alternatives Considered

### TypeScript Interfaces Only

This was rejected because TypeScript interfaces disappear at runtime and cannot validate external JSON.

### Zod as the Single Source of Truth

Zod could provide runtime validation and inferred TypeScript types. This is a reasonable alternative, but JSON Schema was selected because this lab specifically focuses on JSON Schema and structured AI output.

### Free-Text Amenities

This was rejected because inconsistent naming would make filtering and comparison more difficult.

### Embedded Sponsor Objects

Embedding complete sponsor objects inside every property was rejected because it duplicates sponsor data and could cause inconsistent sponsor information across listings.

## Consequences

### Positive

- Invalid external data can be rejected before reaching the UI or database.
- Business constraints are explicitly documented.
- Unexpected fields are rejected.
- The schema can also be supplied to AI systems for structured output.
- Sponsor data does not need to be duplicated across every property.

### Negative

- The JSON Schema must be maintained as the application evolves.
- The existing TypeScript `Property` interface and the new runtime data contract currently use different field structures and will need to be reconciled.
- Controlled amenities require maintaining an agreed vocabulary.
- AJV adds another project dependency.

## Validation Evidence

Five synthetic property records were successfully validated against the schema.

Four intentionally invalid fixtures were rejected:

1. Missing `property_id`
2. Negative `price`
3. Invalid ZIP code
4. Unknown property field

The initial validator configuration also failed because the default AJV configuration did not include JSON Schema Draft 2020-12. The validator layer was corrected by using `Ajv2020` rather than weakening or silently changing the schema.



## AI Normalization Review

### ChatGPT Review

ChatGPT recommended keeping Property and Sponsor as separate entities and using PropertySponsor to represent the many-to-many relationship.

For the current capstone prototype, ChatGPT recommended controlled amenity strings instead of completely free-text amenities. For a larger production system, it recommended using an Amenity entity with a PropertyAmenity join table.

ChatGPT also considered storing sponsor IDs in the JSON `local_sponsors` array reasonable as an API representation, while recommending a PropertySponsor join table for relational database storage.

### Gemini Review

Gemini similarly recommended avoiding free-text amenities because values such as "AC", "Air Conditioning", and "Central A/C" could represent the same concept and make filtering inconsistent.

Gemini recommended controlled amenity values for the capstone prototype and a normalized Amenity and PropertyAmenity relationship for a larger production database.

Gemini also considered sponsor IDs in `local_sponsors` reasonable for JSON/API output but recommended a PropertySponsor junction table when the information is stored in a relational database.

### Useful AI Output

Both AI systems identified the distinction between an API/JSON representation and a normalized relational database representation.

The following recommendations were accepted:

- Use controlled amenity values for the prototype.
- Avoid unrestricted free-text amenities.
- Keep Property and Sponsor as separate concepts.
- Represent the many-to-many database relationship using PropertySponsor.
- Allow `local_sponsors` to contain sponsor IDs in JSON output.
- Consider an Amenity and PropertyAmenity relationship if the project grows.

### Rejected or Modified AI Output

Gemini suggested that a ZIP code uniquely determines a city and state. This was not adopted as a strict rule because ZIP codes do not always map cleanly to exactly one city name. The prototype will continue storing the address fields explicitly.

Gemini also suggested several specific database technologies and ORMs. These recommendations were not adopted because choosing a database engine or ORM is outside the scope of this data-contract decision.

### Verification and Final Decision

AI recommendations were treated as design suggestions rather than automatically accepted changes.

The final design was checked against the project requirements and tested locally with AJV. Five valid synthetic records passed validation, while fixtures containing a missing ID, negative price, invalid ZIP code, and unknown property field were rejected.

The final prototype decision is to use controlled amenity strings and sponsor ID references in JSON while documenting normalized join tables as the preferred approach for a larger relational database.