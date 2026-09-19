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