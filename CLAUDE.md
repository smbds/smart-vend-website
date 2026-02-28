# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Vend NC — a website for a vending machine provider serving local businesses in Raleigh, North Carolina and the greater Triangle region. The company provides free smart vending machines stocked with snacks, drinks, and fresh food (salads, sandwiches). No coffee service. Target locations include workplaces, gyms, indoor sports centers, hospitals, apartments, car dealerships, and colleges.

## Tech Stack

- **Astro** (v5) — static site framework
- **Tailwind CSS** (v4) — utility-first CSS via `@tailwindcss/vite` plugin
- **TypeScript** — strict config extending `astro/tsconfigs/strict`

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (outputs to `dist/`)
- `npm run preview` — preview production build locally

## Branding

- **Primary Green:** `#2DA449`
- **Gray:** `#333333`
- **Logo (color):** `public/SmartVendNC-Logo.svg` — green (#2aa449) + gray (#333) on transparent
- **Logo (monochrome):** `public/SmartVendNC-Logo-Monochrome.svg` — white on transparent (for dark backgrounds)
- **Fonts:** `Outfit` (headings) + `Source Sans 3` (body)

## Architecture

- `src/layouts/` — base HTML layout (imports global.css, meta tags, analytics)
- `src/components/` — reusable Astro components (Navbar, Hero, Footer, etc.)
- `src/pages/` — file-based routing
  - `index.astro` — homepage
  - `services/snacks.astro`, `services/drinks.astro`, `services/fresh-food.astro` — service pages
  - `locations/[city].astro` — local SEO pages (Raleigh, Durham, Cary, Chapel Hill, Apex, Morrisville, Holly Springs, Wake Forest)
- `src/styles/global.css` — Tailwind import + custom CSS variables + font imports
- `public/` — static assets (logos, video, favicon)

## Forms

All forms use [FormSubmit.co](https://formsubmit.co/) — POST to `info@smartvendnc.com`. No backend required.

## Analytics

Google Analytics 4 — measurement ID placeholder in layout, replace `G-XXXXXXXXXX` with actual ID.

## Key Business Details

- **Phone:** (919) 355-8122
- **Address:** 2100 Gateway Centre Blvd, Raleigh, NC 27607
- **Hours:** Mon-Fri 8am-5pm, Sat by appointment, Sun closed
- **Service area:** Raleigh, Durham, Cary, Chapel Hill, Apex, Morrisville, Holly Springs, Wake Forest
- **Value props:** 100% free installation, no contracts, weekly restocking, 24/7 maintenance, AI-powered inventory, healthy options
- **Founder:** Ram (Founder & CEO)
