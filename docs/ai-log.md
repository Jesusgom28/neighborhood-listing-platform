
# AI Development Log

This document records AI-assisted development, accepted and
rejected recommendations, verification, and related commits.

---

<!-- ============================================ -->
<!-- LAB 1 START: NEXT.JS APPLICATION SHELL       -->
<!-- ============================================ -->

# Lab 1 — Next.js Application Shell

## ChatGPT

**Prompt:**

Act as a senior teaching assistant. Propose a minimal Next.js
App Router + TypeScript + Tailwind starter for a neighborhood
property platform. Give a plain-language explanation of the
stack, a file plan, terminal commands, accessibility requirements,
and a verification checklist. Never invent command results
or credentials.

**Output Used:**

ChatGPT recommended a minimal Next.js App Router structure
using TypeScript, Tailwind CSS, semantic HTML, and basic
accessibility practices. It recommended verifying the
application with `npm run dev`, `npm run lint`, and
`npm run build`.

**Output Rejected:**

No AI-generated command results were accepted as evidence.
All commands and tests must be run locally before being
recorded as successful.

**Verification:**

Node, npm, and Git versions were manually verified in
Command Prompt. Application commands were subsequently
tested locally.

**Commit:**

`55644f5` — Set up Next.js application shell

---

## Gemini

**Prompt:**

Act as a senior teaching assistant. Propose a minimal Next.js
App Router + TypeScript + Tailwind starter for a neighborhood
property platform. Give a plain-language explanation of the
stack, a file plan, terminal commands, accessibility requirements,
and a verification checklist. Never invent command results
or credentials.

**Output Used:**

Gemini recommended Next.js App Router, TypeScript, Tailwind
CSS, semantic HTML, keyboard navigation, visible focus
indicators, labeled form controls, and accessibility testing.

**Output Rejected:**

The suggested Lucide, clsx, and tailwind-merge packages were
not necessary for the minimal application shell. Proposed API
routes, property detail pages, filtering, map controls, and
additional components were beyond the scope of Lab 1.

**Verification:**

Gemini's recommendations were compared against the Lab 1
requirements. Only features necessary for the application
shell were selected.

**Commit:**

`55644f5` — Set up Next.js application shell

---

## ChatGPT vs. Gemini Comparison

### Difference 1 — Project Complexity

ChatGPT proposed a minimal application structure focused
on files such as `page.tsx`, `layout.tsx`, `globals.css`,
and the AI log.

Gemini proposed a larger architecture with API routes,
property detail pages, reusable components, filtering,
mock data, utility functions, and additional dependencies.

The smaller ChatGPT structure was selected because Lab 1
required an application shell rather than a complete
property platform.

### Difference 2 — Accessibility Verification

ChatGPT focused on semantic HTML, logical headings,
keyboard-accessible controls, labels, and manual browser
verification.

Gemini proposed more extensive WCAG 2.1 AA verification,
including skip links, contrast ratios, Lighthouse or axe
audits, screen-reader testing, and focus management.

Basic accessibility requirements were prioritized for
Lab 1. Additional accessibility improvements were
addressed in subsequent development.

<!-- ============================================ -->
<!-- LAB 1 END                                   -->
<!-- ============================================ -->

---

<!-- ============================================ -->
<!-- LAB 2 START: COMPONENTS AND ACCESSIBILITY    -->
<!-- ============================================ -->

# Lab 2 — Property Components and Accessibility

## ChatGPT — Accessibility Review

**Prompt:**

Review the property listing interface for semantic HTML
and accessibility. Focus on PropertyCard, SponsorBanner,
SearchFilters, keyboard navigation, responsive behavior,
visible focus indicators, image alt text, and color
contrast. Recommend only changes that can be verified
locally.

**Output Used:**

ChatGPT recommended semantic elements for property cards
and sponsor content, explicit form labels, descriptive
image alt text, visible focus-visible styles, responsive
Tailwind grid classes, and local accessibility testing.

During testing, Lighthouse identified insufficient
foreground/background color contrast. Explicit text
colors were added to light-colored components.

**Output Rejected:**

No generated test results or accessibility scores were
accepted without local verification. Recommendations
unnecessary for the component requirements were not added.

**Verification:**

- Keyboard navigation was manually tested with Tab and
  Shift+Tab.
- Responsive behavior was tested at 375px, 768px, and
  1280px.
- The property layouts displayed 1, 2, and 3 columns.
- Lighthouse Accessibility initially scored 96.
- After correcting color contrast, Accessibility scored 100.
- `npm run lint` passed.
- `npm run build` compiled successfully.

**Commits:**

- `09b361e` — Add accessible property card component
- `8a1f8bd` — Add accessible sponsor banner
- `0382e86` — Add accessible property search filters
- `b7751ba` — Add responsive property listing page
- `d1148b0` — Improve component color contrast and accessibility

<!-- ============================================ -->
<!-- LAB 2 END                                   -->
<!-- ============================================ -->

---

<!-- ============================================ -->
<!-- LAB 7 START: MEDIA PIPELINE AND AI COPY      -->
<!-- ============================================ -->

# Lab 7 — Media Pipeline and AI-Assisted Marketing Copy

## ChatGPT — Marketing Copy Review

**Task:**

Review promotional copy for factual accuracy, unsupported
claims, discriminatory language, artificial urgency,
and guarantees.

**Prompt:**

Using only the approved facts below, review three sponsor
marketing blurbs under 120 characters each. Identify
unverifiable claims, discriminatory wording, artificial
urgency, guarantees, and information not supported by
the source facts. Do not invent business details.

**Source Facts:**

The homepage includes a fictional demonstration sponsor
named Neighborhood Home Services.

Its sample message is:

"Helping local residents with their home service needs."

The demonstration URL is:

https://example.com

No verified real-world business offer, physical address,
expiration date, or stakeholder authorization has been
provided for this demonstration sponsor.

**Review Findings:**

The sample message contains no explicit discount,
guarantee, or urgency claim.

However, the sponsor identity and services are
demonstration content rather than independently
verified business information.

The banner must remain clearly identified as a
demonstration advertisement.

**Output Used:**

- Keep a visible demonstration disclosure.
- Avoid unsupported promotional claims.
- Require human approval before displaying generated
  marketing copy as approved content.
- Preserve the distinction between raw AI output
  and approved marketing copy.

**Output Rejected:**

- Invented discounts or promotional offers.
- Unverified addresses or operating details.
- Guarantees or artificial urgency.
- Claims of stakeholder approval without evidence.

**Verification:**

The application includes an approval-controlled
marketing-copy workflow.

The approved-copy lookup is designed to return only
records marked APPROVED with reviewer and approval
date information.

Draft records must not be presented as approved
promotional copy.

**Human Approval Status:**

No real stakeholder approval is claimed for the
fictional demonstration sponsor.

Approval remains pending.

**Related Implementation:**

- Sponsor marketing-copy database migration.
- Approval status and reviewer metadata.
- Server-side approved-copy retrieval.
- Sponsor placement display restrictions.

**Commit:**

To be recorded after the Lab 7 documentation is committed.

---

## Gemini — Factual Fidelity Review


## Gemini — Factual Fidelity Review

**Tool:** Google AI Studio (Gemini)

**Prompt:**

Generate three promotional copy variants under 120
characters using only the supplied demonstration sponsor
facts. Do not invent offers, prices, addresses, guarantees,
urgency, or demographic targeting.

Provide a fact-to-phrase trace and identify unsupported
claims. Recommend an approval status without granting
approval.

**Source Facts:**

- Business: Neighborhood Home Services
- Type: Fictional demonstration sponsor
- Sample message: Helping local residents with their
  home service needs.
- URL: https://example.com
- No verified real-world offer, address, deadline,
  guarantee, or stakeholder authorization.

### Variant 1

[Demo] Neighborhood Home Services: Helping local residents with their home service needs. https://example.com

**Fact Trace:**

- [Demo] identifies fictional demonstration content.
- Business name matches the supplied name.
- Promotional sentence reproduces the supplied message.
- URL matches the demonstration URL.

**Review:** No unsupported offers, guarantees, urgency,
or demographic targeting identified.

**Status:** DRAFT — pending human review.

### Variant 2

Neighborhood Home Services | Demo: Helping local residents with home service needs. Visit https://example.com

**Fact Trace:**

- Business name matches the supplied name.
- Demo identifies fictional demonstration content.
- Message paraphrases the supplied description.
- URL matches the demonstration URL.

**Review:** No unsupported offers, guarantees, urgency,
or demographic targeting identified.

**Status:** DRAFT — pending human review.

### Variant 3

Demonstration: Neighborhood Home Services helps local residents with home service needs at https://example.com

**Fact Trace:**

- Demonstration identifies fictional content.
- Business name matches the supplied name.
- Message paraphrases the supplied description.
- URL matches the demonstration URL.

**Review:** No unsupported offers, guarantees, urgency,
or demographic targeting identified.

**Status:** DRAFT — pending human review.

### Output Used

Gemini generated three fact-constrained promotional
variants and provided a source-fact trace for each.

All variants retain demonstration labeling and avoid
inventing discounts, deadlines, addresses, or guarantees.

### Output Rejected or Withheld

No variant was approved for publication as real-world
sponsor marketing copy.

Gemini's recommendation of eligibility for human approval
was not treated as actual stakeholder approval.

### Verification

The three variants were reviewed against the supplied
demonstration facts.

The application requires APPROVED status and reviewer
metadata before displaying database-managed promotional
copy.

The sample sponsor message is a demonstration input,
not evidence of actual stakeholder authorization.

### Human Approval Status

All three variants remain DRAFT.

No authorized stakeholder approval is claimed.

**Commit:**

To be recorded after committing Lab 7 documentation.

---


## Media Asset and Performance Evidence

**Asset Inventory:**

See `docs/media-asset-inventory.md`.

**Performance Audit:**

See `docs/media-performance-audit.md`.

**Assets Examined:**

1. Property illustration: `/house-1.svg`
2. Demonstration sponsor banner: `/sponsor-banner.svg`
3. Decorative homepage icon: `/home-icon.svg`

**Responsive Verification:**

Actual image dimensions were measured using
Chrome DevTools at 390px and 1280px viewport widths.

**Performance Verification:**

Chrome DevTools was used to inspect image requests,
transfer sizes, response types, and download times.

Largest Contentful Paint and Cumulative Layout Shift
were also measured during local development testing.

**Limitations:**

- The property asset is an illustration, not a photograph.
- The demonstration sponsor is fictional.
- Individual stakeholder permission and approval for
  the demonstration assets are not claimed.
- Local development measurements do not represent
  production performance.
- A true before-and-after optimization benchmark
  has not yet been established.

<!-- ============================================ -->
<!-- LAB 7 END                                   -->
<!-- ============================================ -->
