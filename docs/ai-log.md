# AI Development Log

## ChatGPT

**Prompt:**  
Act as a senior teaching assistant. Propose a minimal Next.js App Router + TypeScript + Tailwind starter for a neighborhood property platform. Give a plain-language explanation of the stack, a file plan, terminal commands, accessibility requirements, and a verification checklist. Never invent command results or credentials.

**Output Used:**  
ChatGPT recommended a minimal Next.js App Router structure using TypeScript, Tailwind CSS, semantic HTML, and basic accessibility practices. It recommended verifying the application with npm run dev, npm run lint, and npm run build.

**Output Rejected:**  
No AI-generated command results were accepted as evidence. All commands and tests will be run locally before being recorded as successful.

**Verification:**  
Node, npm, and Git versions were manually verified in Command Prompt. Application commands will be tested locally after the Next.js application is created.

**Commit:**  
55644f5 - Set up Next.js application shell
---

## Gemini

**Prompt:**  
Act as a senior teaching assistant. Propose a minimal Next.js App Router + TypeScript + Tailwind starter for a neighborhood property platform. Give a plain-language explanation of the stack, a file plan, terminal commands, accessibility requirements, and a verification checklist. Never invent command results or credentials.

**Output Used:**  
Gemini recommended Next.js App Router, TypeScript, Tailwind CSS, semantic HTML, keyboard navigation, visible focus indicators, labeled form controls, and accessibility testing.

**Output Rejected:**  
The suggested Lucide, clsx, and tailwind-merge packages were not necessary for the minimal app shell required by this lab. The proposed API routes, property detail pages, filtering system, map controls, and additional components were also beyond the scope of the starter application.

**Verification:**  
Gemini's recommendations were compared against the lab requirements. Only features necessary for the required starter application will be implemented and tested locally.

**Commit:**  
55644f5 - Set up Next.js application shell

---

# Comparison

## Difference 1 - Project Complexity

ChatGPT proposed a minimal application structure focused on the files necessary for the lab, such as page.tsx, layout.tsx, globals.css, and the AI log. Gemini proposed a larger architecture containing API routes, property detail routes, reusable UI components, filtering, mock data, utility functions, and additional dependencies.

For this lab, the smaller ChatGPT structure was selected because the assignment asks for a simple application shell rather than a complete property platform.

## Difference 2 - Accessibility Verification

ChatGPT focused on basic semantic HTML, logical headings, keyboard-accessible controls, labels, and manual browser verification. Gemini proposed a more extensive WCAG 2.1 AA process including skip links, contrast ratios, Lighthouse or axe audits, screen-reader testing, and detailed focus management.

The basic accessibility requirements will be implemented for the app shell. Gemini's more extensive accessibility recommendations may be useful in later development but are beyond the minimum requirements of this lab.

---

# Property Components and Accessibility Review

## ChatGPT

**Prompt:**  
Review the property listing interface for semantic HTML and accessibility. Focus on PropertyCard, SponsorBanner, SearchFilters, keyboard navigation, responsive behavior, visible focus indicators, image alt text, and color contrast. Recommend only changes that can be verified locally.

**Output Used:**  
ChatGPT recommended semantic elements for the property cards and sponsor content, explicit form labels, descriptive image alt text, visible focus-visible styles, responsive Tailwind grid classes, and local accessibility testing. During testing, Lighthouse identified insufficient foreground/background color contrast. Explicit text colors were added to light-colored components to correct the issue.

**Output Rejected:**  
No generated test results or accessibility scores were accepted without local verification. Recommendations that were unnecessary for the current component requirements were not added.

**Verification:**  
Keyboard navigation was manually tested using Tab and Shift+Tab. Responsive behavior was tested at 375px, 768px, and 1280px. The layouts displayed 1, 2, and 3 columns respectively. Lighthouse Accessibility initially scored 96 and identified insufficient color contrast. After correcting the contrast, Lighthouse Accessibility scored 100. `npm run lint` passed and `npm run build` compiled successfully.

**Commits:**  
09b361e - Add accessible property card component  
8a1f8bd - Add accessible sponsor banner  
0382e86 - Add accessible property search filters  
b7751ba - Add responsive property listing page  
d1148b0 - Improve component color contrast and accessibility

---

# Lab 3 - JSON Schema, Data Modeling, and Structured AI Output

## ChatGPT - Data Contract Review

**Prompt:**
Given these fictional listing requirements, propose a strict JSON Schema. Identify ambiguous business rules before writing the schema. Then provide valid and intentionally invalid examples and explain what a validator should reject.

The property contract requires a property ID, structured address, price, bedrooms, bathrooms, square feet, amenities, ZIP code, and local sponsor IDs. Property, Sponsor, and PropertySponsor should be treated as separate concepts.

**Output Used:**
ChatGPT recommended separating Property and Sponsor data and representing their many-to-many relationship through PropertySponsor. It also recommended runtime JSON Schema validation instead of relying only on TypeScript interfaces. Controlled amenity values were preferred over unrestricted free text for improving consistency.

**Output Rejected or Modified:**
AI-generated validation results were not treated as evidence. All schema behavior was verified locally with AJV. Recommendations that were outside the scope of the current capstone prototype were not implemented.

**Verification:**
The JSON Schema was validated locally using AJV Draft 2020-12 support. Five synthetic property records passed validation. Four intentionally invalid fixtures were correctly rejected for a missing property ID, negative price, malformed ZIP code, and an unknown property field. Automated contract tests were also created and passed with `npm test`.

---

## Gemini - Normalization Review

**Prompt:**
I am building a fictional neighborhood property listing platform for a college software engineering project.

My property data contract includes:
- property_id
- structured address (street, city, state)
- price
- bedrooms
- bathrooms
- square_feet
- amenities
- zip_code
- local_sponsors containing sponsor IDs

The system separates Property, Sponsor, and PropertySponsor concepts. A property may have multiple sponsors and a sponsor may be associated with multiple properties.

Please review this data model for normalization problems.

Specifically:
1. Should amenities be free text, controlled values, or stored using a separate Amenities table with a join table?
2. Is storing sponsor IDs in local_sponsors reasonable for JSON output?
3. Identify any normalization or data consistency problems.
4. Recommend what is appropriate for a small capstone prototype versus a larger production database.

Do not use real customer or personal data.

**Output Used:**
Gemini recommended avoiding unrestricted free-text amenities, keeping Property and Sponsor as separate concepts, and using a many-to-many relationship for sponsors. Sponsor IDs in JSON were considered reasonable for the prototype, while a relational production database would normally use a junction table.

**Output Rejected or Modified:**
The suggestion that a ZIP code uniquely determines a city and state was not adopted because ZIP codes do not always map cleanly to exactly one city name. Database and ORM recommendations beyond the current lab requirements were also not implemented.

**Verification:**
Gemini's recommendations were compared against the project requirements, JSON Schema, ADR, and local AJV validation results.

---

## Gemini - Synthetic JSON Generation Experiment

**Prompt:**
I am testing JSON generation for a fictional college software engineering project.

Generate exactly five fictional property records that follow the JSON Schema below.

Return ONLY the JSON array. Do not include Markdown, explanations, or code fences.

The data must be completely synthetic.

The project's property JSON Schema was included directly with this prompt.

**Structured Output Limitation:**
During this attempt, the native structured-output/API option in Google AI Studio prompted for billing/payment. Following the lab troubleshooting instructions, the JSON Schema was included directly in the prompt instead, and the generated output was validated locally rather than enabling paid billing.

**Output Used:**
Gemini generated five completely synthetic property records. The unmodified response was saved as `data/generated/gemini-properties.json`.

**Verification:**
The raw Gemini response was tested using the same AJV validator used by the application. All five generated records passed local validation:

- Gemini Property 1: VALID
- Gemini Property 2: VALID
- Gemini Property 3: VALID
- Gemini Property 4: VALID
- Gemini Property 5: VALID

No AI-generated validation claims were accepted as evidence; the validation was performed locally.

---

# Lab 3 Final Verification

The project was verified locally after implementing the data contract:

- `npm test` - passed all valid and invalid contract tests.
- `npm run lint` - passed with no reported lint errors.
- `npm run build` - compiled successfully.
- Next.js TypeScript compilation completed successfully during the production build.
- Five synthetic seed records passed AJV validation.
- Four intentionally invalid records were rejected for the expected reasons.
- Validated property records were rendered through the Week 2 property components.



