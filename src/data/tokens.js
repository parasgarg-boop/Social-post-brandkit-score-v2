export const BUSINESS_TOKENS = [
  { category: "BUSINESS", tokens: [
    { key: "location_name", label: "Location name", example: "Grand Junction - Northeast" },
    { key: "address", label: "Address", example: "150, Main Street" },
    { key: "city", label: "City", example: "Grand Junction" },
    { key: "state", label: "State", example: "Colorado" },
    { key: "zip", label: "Zip code", example: "81501" },
    { key: "phone", label: "Phone number", example: "(970) 555-0142" },
  ]},
  { category: "ONLINE", tokens: [
    { key: "website", label: "Website URL", example: "www.lushlandscaping.com/northeast" },
    { key: "email", label: "Email", example: "northeast@lushlandscaping.com" },
    { key: "booking_url", label: "Booking URL", example: "book.lushlandscaping.com/northeast" },
  ]},
];

export const MOCK_LOCATIONS = [
  {
    id: "loc1", name: "Grand Junction - Northeast",
    values: { location_name: "Grand Junction - Northeast", address: "150, Main Street", city: "Grand Junction", state: "Colorado", zip: "81501", phone: "(970) 555-0142", website: "www.lushlandscaping.com/northeast", email: "northeast@lushlandscaping.com", booking_url: "book.lushlandscaping.com/northeast" },
    fbPage: "Andrew Blogs", fbAvatar: null,
    igProfile: "andrew.blogs", igAvatar: null,
    liPage: "Andrew Garglefield", liAvatar: null,
    twHandle: "@andrewblogs", twAvatar: null,
  },
  {
    id: "loc2", name: "Mag Mile - Chicago",
    values: { location_name: "Mag Mile - Chicago", address: "520 N Michigan Ave", city: "Chicago", state: "Illinois", zip: "60611", phone: "(312) 555-0198", website: "www.lushlandscaping.com/chicago", email: "chicago@lushlandscaping.com", booking_url: "book.lushlandscaping.com/chicago" },
    fbPage: "Lush Chicago", fbAvatar: null,
    igProfile: "lush.chicago", igAvatar: null,
    liPage: "Lush Landscaping Chicago", liAvatar: null,
    twHandle: "@lushchi", twAvatar: null,
  },
  {
    id: "loc3", name: "Hillsdale - South",
    values: { location_name: "Hillsdale - South", address: "88 Hillsdale Blvd", city: "Hillsdale", state: "New Jersey", zip: "07642", phone: "(201) 555-0273", website: "www.lushlandscaping.com/hillsdale", email: "hillsdale@lushlandscaping.com", booking_url: "book.lushlandscaping.com/hillsdale" },
    fbPage: "Lush Hillsdale", fbAvatar: null,
    igProfile: "lush.hillsdale", igAvatar: null,
    liPage: "Lush Landscaping Hillsdale", liAvatar: null,
    twHandle: "@lushhills", twAvatar: null,
  },
];

/* Resolve tokens in text — replaces {{token_key}} with location values or leaves unresolved */
export function resolveTokens(text, location) {
  if (!text) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (location && location.values[key] !== undefined) return location.values[key];
    const allTokens = BUSINESS_TOKENS.flatMap(c => c.tokens);
    const tok = allTokens.find(t => t.key === key);
    return tok ? `{{${tok.label}}}` : match;
  });
}
