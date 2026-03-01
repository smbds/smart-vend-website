export interface LocationData {
  slug: string;
  city: string;
  tagline: string;
  description: string;
  localFlavor: string;
  metaDescription: string;
  highlights: string[];
  testimonial?: {
    quote: string;
    name: string;
    title: string;
  };
}

export const locations: LocationData[] = [
  {
    slug: "raleigh",
    city: "Raleigh",
    tagline: "NC's Capital City & Tech Hub",
    description: "From downtown high-rises along Fayetteville Street to the Warehouse District's converted tech offices, Raleigh's 500,000+ residents expect premium workplace amenities. Smart Vend NC keeps Raleigh businesses stocked with healthy snacks, cold beverages, and fresh food.",
    localFlavor: "Home to 4,000+ tech companies, NC State University, WakeMed Health, and the State of North Carolina's 24,000-person workforce — Raleigh's workforce demands better than stale vending. We serve offices in North Hills, Midtown, the Glenwood South corridor, and throughout the capital city.",
    metaDescription: "Free smart vending machines in Raleigh NC. Healthy snacks, drinks, and fresh food for offices, gyms, hospitals, and colleges. No contracts, fully maintained.",
    highlights: ["Fayetteville Street & Downtown", "North Hills & Midtown", "Warehouse District", "NC State University area", "WakeMed campus"],
    testimonial: {
      quote: "Smart Vend NC transformed our break room. Our team actually gets excited about the snack selection now.",
      name: "Jennifer Walsh",
      title: "Office Manager, Downtown Raleigh",
    },
  },
  {
    slug: "durham",
    city: "Durham",
    tagline: "Bull City Innovation Hub",
    description: "Known as Bull City, Durham has reinvented itself from tobacco roots into a thriving innovation hub. The American Tobacco Campus — a $200M redevelopment of the historic factory — now anchors a downtown buzzing with tech firms, startups, and research organizations.",
    localFlavor: "Duke University and Duke Health are the city's largest employers, while Treyburn Corporate Park houses major operations for Merck, Novo Nordisk, and bioMerieux. From DPAC to the Durham Bulls Athletic Park, this city works hard and plays hard — and deserves vending that keeps up.",
    metaDescription: "Free smart vending machines in Durham NC. Healthy snacks, drinks, and fresh food for offices, gyms, and campuses. No contracts, fully maintained.",
    highlights: ["American Tobacco Campus", "Duke University & Duke Health", "Treyburn Corporate Park", "Durham Bulls Athletic Park", "Downtown Durham"],
    testimonial: {
      quote: "As a facilities manager, I've dealt with vending companies for 20 years. Smart Vend NC is different. Zero hassle, always responsive.",
      name: "Robert Martinez",
      title: "Facilities Manager, Durham",
    },
  },
  {
    slug: "cary",
    city: "Cary",
    tagline: "Home of SAS & Growing Fast",
    description: "With over 190,000 residents, Cary is headquarters to SAS Institute — the world's largest privately held software company — and a hub for corporate campuses, fitness centers, and family-friendly community spaces.",
    localFlavor: "From the sprawling SAS campus to WakeMed Soccer Park (home of the NC Courage), Cary businesses range from tech giants to boutique shops along the rapidly densifying downtown. The American Tobacco Trail greenway connects neighborhoods to workplaces, and we keep machines stocked along the way.",
    metaDescription: "Free smart vending machines in Cary NC. Healthy snacks, drinks, and fresh food for offices, gyms, and community spaces. No contracts, fully maintained.",
    highlights: ["SAS Institute campus area", "WakeMed Soccer Park", "Crossroads Plaza", "Weston Parkway offices", "Downtown Cary"],
  },
  {
    slug: "chapel-hill",
    city: "Chapel Hill",
    tagline: "Home of UNC & Tar Heel Country",
    description: "Defined by UNC-Chapel Hill — the nation's first public university — and UNC Health, Chapel Hill is a community that values health, innovation, and local business. Franklin Street remains the beating heart of town.",
    localFlavor: "From the medical centers at UNC Health to the locally-owned shops along Franklin Street that erupt after every Tar Heel basketball victory, Chapel Hill is a tight-knit community. Planned neighborhoods like Meadowmont, Southern Village, and Briar Chapel each have their own village centers where healthy vending fits right in.",
    metaDescription: "Free smart vending machines in Chapel Hill NC. Healthy snacks, drinks, and fresh food for campuses, medical centers, and businesses. No contracts.",
    highlights: ["UNC-Chapel Hill campus", "UNC Health system", "Franklin Street corridor", "Southern Village", "Meadowmont"],
  },
  {
    slug: "apex",
    city: "Apex",
    tagline: "The Peak of Good Living",
    description: "Nicknamed 'The Peak of Good Living,' Apex has nearly doubled its population to 77,000 residents since 2010. The charming downtown centers on Salem Street and the historic 1867 train depot — the highest point on the old Chatham Railroad that gave the town its name.",
    localFlavor: "From the annual PeakFest drawing thousands to Salem Street, to the Beaver Creek Trail connecting neighborhoods to business parks, Apex blends small-town charm with rapid growth. New office developments and fitness centers along the Apex Peakway need modern vending solutions that match the town's quality of life.",
    metaDescription: "Free smart vending machines in Apex NC. Healthy snacks, drinks, and fresh food for offices, gyms, and businesses. No contracts, fully maintained.",
    highlights: ["Salem Street & Downtown", "Beaver Creek Commons", "Apex Peakway corridor", "American Tobacco Trail", "New business parks"],
  },
  {
    slug: "morrisville",
    city: "Morrisville",
    tagline: "Triangle's Tech Crossroads",
    description: "Morrisville sits at the geographic crossroads of the Triangle, bordering Research Triangle Park and minutes from RDU International Airport. Lenovo chose Morrisville for its North American headquarters, bringing $1.5B in annual economic impact.",
    localFlavor: "With 30,000 residents and proximity to RTP's 7,000-acre research campus (300+ companies, 55,000 workers), Morrisville punches well above its weight as a business address. Tech and biotech firms along Perimeter Park and McCrimmon Parkway need vending that matches their innovation — not outdated machines with stale chips.",
    metaDescription: "Free smart vending machines in Morrisville NC. Healthy snacks, drinks, and fresh food for offices and corporate campuses near RTP. No contracts.",
    highlights: ["Lenovo HQ area", "Research Triangle Park", "Perimeter Park", "McCrimmon Parkway", "RDU Airport corridor"],
  },
  {
    slug: "holly-springs",
    city: "Holly Springs",
    tagline: "Biotech Boomtown",
    description: "Holly Springs has exploded to over 51,000 residents — a 108% increase since 2010 — and emerged as a global biomanufacturing hub. Genentech is building its first East Coast manufacturing facility here with a nearly $2B investment.",
    localFlavor: "With Genentech, Seqirus (CSL), FUJIFILM Biotechnologies, and Amgen along the life sciences corridor, Holly Springs draws a highly educated workforce with a median household income over $132,000. These professionals expect premium options — not the same old vending machines their parents used.",
    metaDescription: "Free smart vending machines in Holly Springs NC. Healthy snacks, drinks, and fresh food for biotech facilities, offices, and sports centers. No contracts.",
    highlights: ["Biotech & life sciences corridor", "Holly Springs Towne Center", "Genentech facility area", "Sports complexes", "New business parks"],
  },
  {
    slug: "wake-forest",
    city: "Wake Forest",
    tagline: "Historic Charm, Modern Growth",
    description: "With over 54,000 residents and a $500M UNC Health Rex hospital complex under construction, Wake Forest is experiencing its largest-ever development boom while preserving its small-town character.",
    localFlavor: "Wake Forest Exchange — a 30-acre mixed-use development along Capital Boulevard with 166,000+ sq ft of Class A office space — is bringing a new wave of businesses to town. The upcoming Wake Forest Food Hall (20,000 sq ft with three acres of greenspace) reflects a community that values quality. Our smart vending machines fit right into that vision.",
    metaDescription: "Free smart vending machines in Wake Forest NC. Healthy snacks, drinks, and fresh food for offices, gyms, and businesses. No contracts, fully maintained.",
    highlights: ["Wake Forest Exchange", "UNC Health Rex campus", "Capital Boulevard corridor", "Downtown Wake Forest", "Heritage business parks"],
  },
];
