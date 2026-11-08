
# CIS 3610 Lab 7 — Media Performance Audit

## Test Environment

- Application: Neighborhood Listing Platform
- Browser: Google Chrome
- Tool: Chrome DevTools Network
- Environment: Local Next.js development server
- Cache: Disabled
- Network throttling: None
- Viewports tested: 1280 × 768 and 390 × 768

## Asset File Sizes

| Asset | Disk Size |
|---|---:|
| house-1.svg | 444 bytes |
| house-2.svg | 444 bytes |
| house-3.svg | 444 bytes |
| sponsor-banner.svg | 1,533 bytes |
| home-icon.svg | 560 bytes |

Total: 3,425 bytes (approximately 3.34 KiB).

## Desktop Network Results — 1280px

| Asset | Transferred | Time | Status |
|---|---:|---:|---|
| home-icon.svg | 0.9 KB | 12 ms | 200 |
| house-1.svg | 0.7 KB | 13 ms | 200 |
| house-2.svg | 0.7 KB | 13 ms | 200 |
| house-3.svg | 0.7 KB | 10 ms | 200 |
| sponsor-banner.svg | 1.0 KB | 6 ms | 200 |

Note: Chrome displays rounded transfer sizes, which can include HTTP overhead.

## Mobile Results — 390px

- Homepage heading and decorative icon displayed.
- Search filters stacked vertically.
- Property cards displayed in a single column.
- Sponsor banner fit within the mobile card.
- Sponsor disclosure and website link remained visible.
- All five image requests returned HTTP 200.
- Text embedded inside the SVG banner appeared small on mobile.

## Accessibility

- Property images have descriptive alt text.
- Sponsor banner has identifying alt text.
- Decorative homepage icon uses an empty alt attribute.
- Sponsored content is visibly disclosed.


## Desktop Largest Contentful Paint (LCP)

- Viewport: 1280 × 768
- Tool: Chrome DevTools Performance
- LCP: 352.9 ms (approximately 0.35 seconds)
- LCP element: h1 — Neighborhood Listings
- Element type: Text
- Cumulative Layout Shift (CLS): 0
- Environment: Local Next.js development server
- Network throttling: None

The measured desktop LCP is below the recommended
2.5-second threshold.

This is a local development measurement and does not
represent production or real-user performance.


## Mobile Largest Contentful Paint (LCP)

- Viewport: 390 × 768
- Tool: Chrome DevTools Performance
- LCP: 393.6 ms (approximately 0.39 seconds)
- LCP element: Property image
- Element type: Image
- Cumulative Layout Shift (CLS): 0
- Environment: Local Next.js development server
- Network throttling: None

## Desktop vs. Mobile Comparison

| Metric | Desktop | Mobile |
|---|---:|---:|
| Viewport width | 1280px | 390px |
| LCP | 352.9 ms | 393.6 ms |
| CLS | 0 | 0 |
| LCP element | Page heading | Property image |

The mobile LCP was 40.7 ms slower in these individual
recordings. Both results were below 2.5 seconds.

These are preliminary local measurements, not
production benchmarks or real-device mobile tests.


## Limitations

- Results were measured on a local development server.
- No production performance benchmark has been recorded.
- Largest Contentful Paint (LCP) has not been measured.
- No before-and-after optimization benchmark is available.
- Existing property illustration licenses still require verification.

## Next Steps

- Measure LCP using Chrome DevTools Performance.
- Review image readability on smaller screens.
- Verify existing property illustration sources and permissions.
- Repeat performance measurements on a production build.
