# Smart Vend NC — Implementation Plan

## 1. Design System & Global Setup

### 1.1 Global Styles (`src/styles/global.css`)
- Import Tailwind via `@import "tailwindcss"`
- Define CSS custom properties for brand colors:
  - `--color-primary`: `#2DA449` (green)
  - `--color-gray`: `#333333`
  - Extended palette: light green tints (`#e8f5ec`, `#c6e9cf`), off-white (`#f9faf8`), soft grays (`#6b7280`, `#9ca3af`)
- Import Google Fonts: `Outfit` (400, 500, 600, 700) + `Source Sans 3` (400, 500, 600)
- Base resets and smooth scrolling

### 1.2 Layout (`src/layouts/Layout.astro`)
- HTML shell with `<head>` containing:
  - Meta charset, viewport, description, Open Graph tags
  - Favicon references
  - Google Fonts preconnect + stylesheet links
  - Google Analytics 4 script with placeholder `G-XXXXXXXXXX`
  - Global CSS import
- Props: `title`, `description`, `ogImage` (for per-page SEO)
- Slot for page content

---

## 2. Shared Components

### 2.1 Navbar (`src/components/Navbar.astro`)
- Sticky top, white background with glass-blur effect on scroll
- Left: color logo (`SmartVendNC-Logo.svg`)
- Center/right: nav links — Services (dropdown: Snacks, Drinks, Fresh Food), Why Us, Reviews, About, Locations
- Right: "Get Started" CTA button (green)
- Mobile: hamburger menu with slide-out drawer
- Requires minimal `<script>` for mobile toggle and scroll blur

### 2.2 Footer (`src/components/Footer.astro`)
- Dark background (`#333333`)
- 4-column grid:
  - Col 1: Monochrome logo + company description
  - Col 2: Services links (Snacks, Drinks, Fresh Food)
  - Col 3: Locations links (all 8 cities)
  - Col 4: Contact info (phone, email) + "Why Us" links
- Bottom bar: copyright + Privacy Policy + Terms of Service links
- Sticky mobile CTA bar: "Call Now: (919) 355-8122"

### 2.3 ContactForm (`src/components/ContactForm.astro`)
- HTML form with `action="https://formsubmit.co/info@smartvendnc.com"` method="POST"
- Fields: Name, Email, Phone, Company/Location, Message
- Hidden fields for FormSubmit config:
  - `_subject`: "New Smart Vend NC Inquiry"
  - `_captcha`: "true"
  - `_template`: "table"
  - `_next`: thank you redirect URL
- Green submit button: "Request Free Installation"
- Reusable across homepage and service/location pages

### 2.4 CTABanner (`src/components/CTABanner.astro`)
- Reusable call-to-action strip for service and location pages
- Green background, white text, CTA button
- Props: `heading`, `subheading`, `buttonText`, `buttonLink`

### 2.5 ServiceCard (`src/components/ServiceCard.astro`)
- Card component for service categories
- Props: `title`, `description`, `items[]`, `icon`, `link`
- Hover lift effect with shadow

### 2.6 TestimonialCard (`src/components/TestimonialCard.astro`)
- Quote, author name, title/location, date
- Large decorative quote marks
- Props: `quote`, `name`, `title`, `date`

### 2.7 StatCounter (`src/components/StatCounter.astro`)
- Animated number counter with label
- Props: `value`, `suffix`, `label`
- Uses IntersectionObserver to trigger count-up animation

---

## 3. Homepage (`src/pages/index.astro`)

### Section 3.1: Hero
- Split layout: text left, decorative visual right
- Headline: "Smart Vending for Every Space" (with subtext covering workplaces, gyms, sports centers, hospitals, apartments, dealerships, colleges)
- 3 feature badges: "100% Free Installation", "Healthy & Fresh Options", "AI-Powered Inventory"
- Two CTAs: "Request a Free Machine" (green) + "See Our Services" (outline)
- Subtle animated grain texture background

### Section 3.2: Video Showcase ("See Our Machines in Action")
- Dedicated section below hero
- Heading + short description
- Native `<video>` element with controls, poster frame
- Source: `/SmartMart Walkthrough for Customers - MediaLink Video.mp4`
- Styled container with rounded corners, shadow

### Section 3.3: Services
- Section heading: "Premium Refreshments, Delivered Free"
- 3 ServiceCards:
  - **Snacks & Bars** — Protein bars, chips, nuts, granola, candy. Links to `/services/snacks`
  - **Cold Beverages** — Water, sodas, energy drinks, juices, sports drinks. Links to `/services/drinks`
  - **Fresh Food** — Salads, sandwiches, wraps, healthy meals. Links to `/services/fresh-food`
- "We Handle Everything" strip with 4 icon badges: Free Installation, Weekly Restocking, 24/7 Maintenance, No Contracts

### Section 3.4: Why Choose Us
- 2x2 grid of feature blocks:
  1. **Zero Cost to You** — free machines, installation, stocking, maintenance
  2. **Healthy Choices** — curated nutritious snacks, drinks, and fresh food
  3. **Modern Smart Machines** — AI-powered inventory, always stocked
  4. **Local & Family Operated** — Triangle-based, same-day response
- Each block: icon + heading + description
- Subtle entrance animation on scroll

### Section 3.5: Testimonials
- Heading: "What Our Customers Say"
- 3 TestimonialCards (Jennifer Walsh, Robert Martinez, Amanda Foster)
- Horizontal layout on desktop, stacked on mobile

### Section 3.6: About + Stats
- Split layout:
  - Left: "Vending, Reimagined" heading, story paragraph, founder quote with attribution
  - Right: 3 StatCounters (10+ Locations, 50+ Varieties, 99.5% Uptime)
- Service area subsection: "Serving the Triangle" with city pill links to location pages

### Section 3.7: Contact
- Split layout:
  - Left: ContactForm component
  - Right: contact info panel — phone, key promises (4 checkmarks), "Prefer to Call?" callout

---

## 4. Service Pages

Each service page follows the same template structure:

### Template: `src/layouts/ServicePage.astro` (or inline in each page)
1. Hero banner — service-specific heading, description, key items
2. Detail section — expanded description of the service offering, item categories
3. "How It Works" — 3-step process (Request → Install → Enjoy)
4. Video embed — same walkthrough video
5. CTABanner — "Get Your Free Machine"
6. ContactForm — inline form

### 4.1 Snacks (`src/pages/services/snacks.astro`)
- Focus: protein bars, chips, nuts, granola, candy, trail mix
- SEO title: "Snack Vending Machines in Raleigh NC | Smart Vend NC"
- SEO description targeting snack vending keywords

### 4.2 Drinks (`src/pages/services/drinks.astro`)
- Focus: water, sodas, energy drinks, juices, sports drinks
- SEO title: "Beverage Vending Machines in Raleigh NC | Smart Vend NC"

### 4.3 Fresh Food (`src/pages/services/fresh-food.astro`)
- Focus: salads, sandwiches, wraps, healthy prepared meals
- SEO title: "Fresh Food Vending Machines in Raleigh NC | Smart Vend NC"
- Emphasize healthy eating, AI-powered freshness tracking

---

## 5. Local SEO Pages

Each location page follows the same template with city-specific content:

### Template structure:
1. Hero — "Smart Vending in [City], NC"
2. City-specific paragraph — mention local landmarks, business districts, neighborhoods
3. Services offered (3 cards linking to service pages)
4. Why local businesses choose Smart Vend NC
5. Testimonial (rotate per city if possible)
6. CTABanner + ContactForm
7. Structured data (LocalBusiness schema with city-specific info)

### Pages (all under `src/pages/locations/`):
| File | City | SEO Title |
|------|------|-----------|
| `raleigh.astro` | Raleigh | "Vending Machine Services in Raleigh NC \| Smart Vend NC" |
| `durham.astro` | Durham | "Vending Machine Services in Durham NC \| Smart Vend NC" |
| `cary.astro` | Cary | "Vending Machine Services in Cary NC \| Smart Vend NC" |
| `chapel-hill.astro` | Chapel Hill | "Vending Machine Services in Chapel Hill NC \| Smart Vend NC" |
| `apex.astro` | Apex | "Vending Machine Services in Apex NC \| Smart Vend NC" |
| `morrisville.astro` | Morrisville | "Vending Machine Services in Morrisville NC \| Smart Vend NC" |
| `holly-springs.astro` | Holly Springs | "Vending Machine Services in Holly Springs NC \| Smart Vend NC" |
| `wake-forest.astro` | Wake Forest | "Vending Machine Services in Wake Forest NC \| Smart Vend NC" |

---

## 6. Analytics & Tracking

### 6.1 Google Analytics 4
- Add GA4 script to `Layout.astro` `<head>`:
  ```html
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
  ```
- Replace `G-XXXXXXXXXX` with actual Measurement ID

### 6.2 How to Get Your Google Analytics Measurement ID
1. Go to [analytics.google.com](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **Admin** (gear icon, bottom-left)
4. Under **Property**, click **Create Property**
5. Enter property name: "Smart Vend NC Website"
6. Select reporting time zone: Eastern Time (US)
7. Select currency: US Dollar
8. Click **Next**, fill in business details, click **Create**
9. Under **Data Streams**, click **Web**
10. Enter URL: `https://smartvendnc.com` and stream name: "Smart Vend NC"
11. Click **Create Stream**
12. Copy the **Measurement ID** (starts with `G-`)
13. Replace `G-XXXXXXXXXX` in `src/layouts/Layout.astro` with your ID

### 6.3 Google Search Console
- Add meta verification tag slot in `Layout.astro`:
  ```html
  <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
  ```
- Steps to set up:
  1. Go to [search.google.com/search-console](https://search.google.com/search-console)
  2. Add property → URL prefix → enter `https://smartvendnc.com`
  3. Choose HTML tag verification method
  4. Copy the `content` value and replace the placeholder in Layout.astro
  5. Submit sitemap: `https://smartvendnc.com/sitemap.xml` (Astro can generate this)

---

## 7. SEO & Structured Data

- Each page: unique `<title>`, `<meta name="description">`, Open Graph tags
- Homepage: Organization + LocalBusiness JSON-LD schema
- Service pages: Service schema
- Location pages: LocalBusiness schema with city-specific address info
- Auto-generated sitemap via `@astrojs/sitemap` integration
- Robots.txt in `public/`

---

## 8. Implementation Order

### Phase 1: Foundation
1. Set up `global.css` with brand tokens, fonts, base styles
2. Create `Layout.astro` with head, analytics placeholders, font loading
3. Build `Navbar.astro` (desktop + mobile)
4. Build `Footer.astro`

### Phase 2: Homepage
5. Build Hero section
6. Build Video Showcase section
7. Build Services section + ServiceCard component
8. Build Why Choose Us section
9. Build Testimonials section + TestimonialCard component
10. Build About + Stats section + StatCounter component
11. Build Contact section + ContactForm component
12. Assemble homepage `index.astro`

### Phase 3: Service Pages
13. Build service page template/layout
14. Create snacks.astro
15. Create drinks.astro
16. Create fresh-food.astro

### Phase 4: Location Pages
17. Build location page template
18. Create all 8 location pages with city-specific content

### Phase 5: Polish & SEO
19. Add JSON-LD structured data to all pages
20. Install and configure `@astrojs/sitemap`
21. Create `robots.txt`
22. Add Open Graph meta images
23. Test all FormSubmit forms
24. Cross-browser and mobile responsive testing
