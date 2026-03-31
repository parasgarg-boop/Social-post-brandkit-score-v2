export const DEFAULT_BRANDS = [
  {
    id: 1, name: "Lush Landscaping", isDefault: true, locations: "All locations",
    domain: "lushlandscaping.com", logo: "\u{1F33F}", logoColor: "#2D5A27",
    voice: {
      personality: ["Friendly", "Professional", "Authentic"],
      tone: ["Persuasive", "Casual", "Simple"],
    },
    kit: {
      colors: { primary: "#4CAF50", secondary: "#E8F5E9", dark: "#2E7D32", headerFont: "#FFFFFF", bodyFont: "#1B5E20", ctaFont: "#FFFFFF" },
      fonts: { header: "Roboto", headerWeight: "Bold", body: "Roboto", bodyWeight: "Regular" },
      logos: ["lush-logo.png"],
    },
    createdBy: "Katie Sanders", createdOn: "Feb 06, 2026",
  },
  {
    id: 2, name: "Victoria's Secret Chicago", locations: "Mag Mile",
    domain: "victoriassecret.com", logo: "\u{1F497}", logoColor: "#E91E63",
    voice: {
      personality: ["Elegant", "Bold", "Confident"],
      tone: ["Aspirational", "Empowering", "Luxurious"],
    },
    kit: {
      colors: { primary: "#E91E63", secondary: "#FCE4EC", dark: "#1A1A1A", headerFont: "#FFFFFF", bodyFont: "#212121", ctaFont: "#FFFFFF" },
      fonts: { header: "Playfair Display", headerWeight: "Bold", body: "Lato", bodyWeight: "Regular" },
      logos: ["vs-logo.png"],
    },
    createdBy: "Andy Carpenter", createdOn: "Feb 19, 2026",
  },
  {
    id: 3, name: "DR Horton", locations: "Hillsdale",
    domain: "drhorton.com", logo: "\u{1F3E0}", logoColor: "#1565C0",
    voice: {
      personality: ["Trustworthy", "Expert", "Welcoming"],
      tone: ["Informative", "Warm", "Clear"],
    },
    kit: {
      colors: { primary: "#1565C0", secondary: "#BBDEFB", dark: "#0D47A1", headerFont: "#FFFFFF", bodyFont: "#1A237E", ctaFont: "#FFFFFF" },
      fonts: { header: "Montserrat", headerWeight: "Bold", body: "Source Sans Pro", bodyWeight: "Regular" },
      logos: ["drh-logo.png"],
    },
    createdBy: "Andy Carpenter", createdOn: "Feb 26, 2026",
  },
];

export const PERSONALITY_OPTIONS = ["Friendly", "Professional", "Authentic", "Bold", "Playful", "Elegant", "Caring", "Innovative", "Trustworthy", "Expert", "Welcoming", "Confident"];
export const TONE_OPTIONS = ["Persuasive", "Casual", "Simple", "Formal", "Empowering", "Luxurious", "Aspirational", "Informative", "Warm", "Clear", "Energetic", "Empathetic"];
export const FONT_OPTIONS = ["Roboto", "Inter", "Montserrat", "Open Sans", "Lato", "Poppins", "Playfair Display", "Source Sans Pro", "Raleway", "Merriweather"];
