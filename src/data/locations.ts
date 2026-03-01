export interface LocationData {
  slug: string;
  city: string;
  description: string;
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
    description: "As the capital city and a thriving tech hub, Raleigh's offices, gyms, hospitals, and college campuses deserve premium vending. From downtown high-rises to Research Triangle Park, Smart Vend NC keeps Raleigh businesses stocked with healthy snacks, cold beverages, and fresh food.",
    metaDescription: "Free smart vending machines in Raleigh NC. Healthy snacks, drinks, and fresh food for offices, gyms, hospitals, and colleges. No contracts, fully maintained.",
    highlights: ["Downtown Raleigh offices", "NC State University area", "Research Triangle Park", "WakeMed Hospital area", "North Hills & Midtown"],
    testimonial: {
      quote: "Smart Vend NC transformed our break room. Our team actually gets excited about the snack selection now.",
      name: "Jennifer Walsh",
      title: "Office Manager, Downtown Raleigh",
    },
  },
  {
    slug: "durham",
    city: "Durham",
    description: "Durham's booming tech scene and vibrant health community make it a perfect fit for smart vending. From Duke University to American Tobacco Campus, we serve Durham businesses with AI-powered machines stocked with nutritious options.",
    metaDescription: "Free smart vending machines in Durham NC. Healthy snacks, drinks, and fresh food for offices, gyms, and campuses. No contracts, fully maintained.",
    highlights: ["Duke University area", "American Tobacco Campus", "Durham Tech corridor", "Research Triangle Park", "Downtown Durham"],
    testimonial: {
      quote: "As a facilities manager, I've dealt with vending companies for 20 years. Smart Vend NC is different. Zero hassle, always responsive.",
      name: "Robert Martinez",
      title: "Facilities Manager, Durham",
    },
  },
  {
    slug: "cary",
    city: "Cary",
    description: "Cary's growing business parks, fitness centers, and family-friendly community spaces are ideal for healthy vending. We provide Cary businesses with smart machines that feature fresh food, nutritious snacks, and cold beverages — all maintained and restocked for free.",
    metaDescription: "Free smart vending machines in Cary NC. Healthy snacks, drinks, and fresh food for offices, gyms, and community spaces. No contracts, fully maintained.",
    highlights: ["Cary Towne Center area", "Regency Park", "Weston Parkway offices", "Crossroads Plaza", "Preston business parks"],
  },
  {
    slug: "chapel-hill",
    city: "Chapel Hill",
    description: "Home to UNC Chapel Hill, this college town thrives on healthy living and innovation. Smart Vend NC serves Chapel Hill with machines perfect for university facilities, medical centers, sports complexes, and local businesses looking for premium vending options.",
    metaDescription: "Free smart vending machines in Chapel Hill NC. Healthy snacks, drinks, and fresh food for campuses, medical centers, and businesses. No contracts.",
    highlights: ["UNC Chapel Hill campus area", "UNC Hospitals", "Franklin Street businesses", "Southern Village", "Meadowmont"],
  },
  {
    slug: "apex",
    city: "Apex",
    description: "Named one of the best places to live in America, Apex is home to growing businesses, modern fitness centers, and active communities. Smart Vend NC provides Apex locations with free smart vending machines stocked with healthy, high-quality refreshments.",
    metaDescription: "Free smart vending machines in Apex NC. Healthy snacks, drinks, and fresh food for offices, gyms, and businesses. No contracts, fully maintained.",
    highlights: ["Downtown Apex", "Beaver Creek Commons", "Apex Peakway corridor", "Salem Street businesses", "Technology parks"],
  },
  {
    slug: "morrisville",
    city: "Morrisville",
    description: "Morrisville sits at the heart of the Triangle, with proximity to RTP and RDU Airport making it a hub for tech companies and corporate offices. Smart Vend NC equips Morrisville workplaces with AI-powered vending machines that keep teams fueled and productive.",
    metaDescription: "Free smart vending machines in Morrisville NC. Healthy snacks, drinks, and fresh food for offices and corporate campuses near RTP. No contracts.",
    highlights: ["Research Triangle Park", "Perimeter Park", "Airport Boulevard corridor", "McCrimmon Parkway", "Corporate campuses"],
  },
  {
    slug: "holly-springs",
    city: "Holly Springs",
    description: "Holly Springs is one of the fastest-growing towns in the Triangle, with new businesses, sports facilities, and community centers opening regularly. Smart Vend NC is ready to serve Holly Springs with healthy vending solutions that match the town's active lifestyle.",
    metaDescription: "Free smart vending machines in Holly Springs NC. Healthy snacks, drinks, and fresh food for offices, gyms, and sports facilities. No contracts.",
    highlights: ["Holly Springs Towne Center", "Holly Springs sports complexes", "Main Street businesses", "Bass Lake area", "New business parks"],
  },
  {
    slug: "wake-forest",
    city: "Wake Forest",
    description: "Wake Forest blends historic charm with modern growth, featuring new offices, fitness centers, and community spaces. Smart Vend NC provides Wake Forest businesses with free, fully-maintained smart vending machines stocked with healthy snacks, drinks, and fresh food.",
    metaDescription: "Free smart vending machines in Wake Forest NC. Healthy snacks, drinks, and fresh food for offices, gyms, and businesses. No contracts, fully maintained.",
    highlights: ["Downtown Wake Forest", "Heritage business parks", "Capital Boulevard corridor", "Walmart Supercenter area", "Sports facilities"],
  },
];
