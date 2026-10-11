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




### Gemini — Stakeholder Interview Question Review

**Date:** October 10, 2026

**Prompt:** Review these eight stakeholder discovery questions for leading wording, privacy-invasive requests, assumptions, and bias. Recommend neutral alternatives. Do not invent stakeholder answers.

**Useful Output:**

Gemini evaluated the eight interview questions and identified several areas for improvement:

- Question 2 focused too heavily on time rather than other workflow challenges.
- Question 3 assumed that stakeholder information was always publicly published.
- Question 5 assumed stakeholders already had a formal content approval process.
- Question 6 assumed stakeholders measured success specifically through listings or promotions.
- Question 8 could better address technical limitations and workflow changes.

Gemini recommended more neutral wording that allows stakeholders to describe their actual experiences without being guided toward specific answers.

**Accepted Changes:**

- Expanded Question 2 to include workflow challenges beyond time.
- Updated Question 3 to include shared or distributed information.
- Revised Question 5 to avoid assuming a formal approval process.
- Broadened Question 6 to address general measures of success.
- Expanded Question 8 to include technical constraints and adoption challenges.

**Rejected or Modified Output:**

- Did not adopt Gemini's suggestion to tailor the questions toward IT managers or unrelated business leaders because the project focuses on property professionals and local sponsors.
- Kept the questions focused on the two stakeholder groups identified in the assignment.

**Verification:**

Compared Gemini's recommendations against the original eight questions and the assignment requirements.

Confirmed that the revised questions remain open-ended and cover workflow, audience, content approval, success measures, and accessibility.

No stakeholder responses were generated or treated as real interview evidence.

**Status:** Gemini critique completed and reviewed.