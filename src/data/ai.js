import { AI_IMAGE_SUGGESTIONS } from './media';

export { AI_IMAGE_SUGGESTIONS };

export const AI_MENU = {
  generate: [
    { id: "holiday", icon: "\u{1F384}", label: "Holiday posts", desc: "Generate seasonal & holiday themed content" },
    { id: "ideas", icon: "\u{1F4A1}", label: "Post ideas", desc: "Get topic suggestions based on your brand" },
    { id: "hashtags", icon: "#", label: "Hashtags", desc: "Generate relevant hashtags for your post" },
    { id: "images", icon: "\u{1F5BC}\uFE0F", label: "Images", desc: "AI-suggested images from Pexels" },
  ],
  modify: [
    { id: "tone", icon: "\u{1F3A8}", label: "Change tone", desc: "Adjust writing style & tone", hasSub: true },
    { id: "shorter", icon: "\u{1F4D0}", label: "Make shorter", desc: "Condense your post while keeping the message" },
    { id: "longer", icon: "\u{1F4CF}", label: "Make longer", desc: "Expand with more detail and engagement" },
    { id: "grammar", icon: "\u2713", label: "Fix spelling and grammar", desc: "Clean up typos, grammar, and punctuation" },
  ],
  configure: [
    { id: "prompts", icon: "\u2699\uFE0F", label: "AI prompts", desc: "Manage saved prompt templates", external: true },
  ],
};

export const TONE_OPTIONS_AI = ["Professional", "Casual", "Friendly", "Bold", "Inspirational", "Humorous", "Urgent", "Empathetic"];

export const SUGGESTED_TOPICS = [
  "Transform your yard into a lush outdoor paradise today",
  "Professional landscaping design that enhances your property's natural beauty",
  "Regular maintenance keeps your lawn looking fresh and healthy",
  "Power washing services reveal your outdoor space's true shine",
  "Expert lawn mowing for a perfectly manicured yard appearance",
  "Custom landscape design tailored to your vision and style",
  "Stunning outdoor living spaces start with quality landscaping care",
  "Let us handle maintenance while you enjoy your yard",
  "Beautiful lawns begin with professional landscaping expertise and passion",
  "Complete outdoor transformation through design, installation, and maintenance services",
];

/* Mock AI generation — simulates content generation with brand awareness */
export function mockAIGenerate({ mode, prompt, brand, tone, existingContent, briefText, channels }) {
  const brandName = brand?.name || "your business";
  const personality = brand?.voice?.personality?.join(", ") || "professional";
  const toneStyle = tone || brand?.voice?.tone?.[0] || "engaging";

  if (mode === "ideas") {
    return SUGGESTED_TOPICS;
  }

  if (mode === "hashtags") {
    const base = brandName.replace(/[^a-zA-Z]/g, "").toLowerCase();
    return [
      `#${base}`, "#landscaping", "#outdoordesign", "#yardtransformation",
      "#gardendesign", "#outdoorliving", "#lawncare", "#curbeappeal",
      "#backyardgoals", "#landscapedesign", "#greenthumb", "#yardmakeover",
    ];
  }

  if (mode === "shorter" && existingContent) {
    const sentences = existingContent.split(/[.!?]+/).filter(s => s.trim());
    return sentences.slice(0, Math.ceil(sentences.length / 2)).join(". ").trim() + ".";
  }

  if (mode === "longer" && existingContent) {
    return existingContent + `\n\nAt ${brandName}, we're passionate about delivering results that exceed expectations. Our team of experts is ready to help you achieve your goals. Visit us today or book online to get started!\n\n\u{1F4DE} Call now for a free consultation\n\u{1F310} Link in bio`;
  }

  if (mode === "grammar" && existingContent) {
    return existingContent
      .replace(/\s{2,}/g, " ")
      .replace(/\bi\b/g, "I")
      .replace(/\s+([.,!?])/g, "$1");
  }

  if (mode === "tone" && existingContent) {
    const toneMap = {
      "Professional": `We are pleased to share our latest offering at ${brandName}. Our team of dedicated professionals delivers exceptional results tailored to your unique needs. We invite you to experience the difference that expertise and commitment can make. Contact us today to schedule a consultation.`,
      "Casual": `Hey there! \u{1F44B} Just wanted to share something cool from ${brandName}. We've been doing some amazing work lately and honestly? We're pretty proud of it. Come check us out \u2014 we'd love to show you what we can do! \u{1F60A}`,
      "Friendly": `Hi friends! \u2600\uFE0F The team at ${brandName} is excited to connect with you! We love what we do, and it shows in every project. Whether you're just starting out or ready for a big change, we're here for you. Let's make something beautiful together! \u{1F49A}`,
      "Bold": `\u{1F525} READY FOR A TRANSFORMATION? ${brandName} doesn't just meet expectations \u2014 we CRUSH them. Our results speak louder than words. Don't settle for average. Choose excellence. Choose ${brandName}. Your move. \u{1F4AA}`,
      "Inspirational": `Every great space starts with a vision. At ${brandName}, we believe in the power of transformation \u2014 turning ordinary into extraordinary, one project at a time. Your dream space is closer than you think. Let's bring it to life together. \u2728`,
      "Humorous": `Plot twist: your ${brandName.includes("Landscap") ? "yard" : "space"} could actually look AMAZING. \u{1F631} We know, shocking. But seriously \u2014 our team works magic (okay, not actual magic, but it's close). Come see for yourself! \u{1F604}`,
      "Urgent": `\u23F0 LIMITED SPOTS AVAILABLE! ${brandName} is booking fast this season. Don't miss your chance to work with the best. Our calendar fills up quickly \u2014 secure your appointment TODAY before it's too late!`,
      "Empathetic": `We understand \u2014 finding the right partner for your project can feel overwhelming. At ${brandName}, we listen first. Your needs, your budget, your timeline \u2014 they all matter to us. Let's start with a conversation and go from there. We're in this together. \u{1F49B}`,
    };
    return toneMap[tone] || toneMap["Professional"];
  }

  // Default: generate from prompt + brief
  const briefContext = briefText ? ` Drawing on the campaign brief: "${briefText.substring(0, 80)}..."` : "";
  const promptContext = prompt ? prompt : "Create an engaging social media post";
  return `Ready to turn your ordinary yard into something amazing? \u{1F33F} [Location name] makes it simple to create the outdoor space you've always dreamed of.${briefContext ? "\n\n" : "\n\n"}Picture stepping outside to your own personal retreat - vibrant plants, perfectly designed layouts, and a space that truly reflects your style. We handle everything from concept to completion, so you can sit back and watch your vision come to life.\n\nOur team brings years of experience and genuine passion for creating beautiful outdoor spaces. We listen to your ideas, work within your budget, and deliver results that exceed expectations.\n\nDon't wait another season to love your yard. Your dream outdoor paradise is closer than you think.\n\nWhat's the one thing you'd love to see in your perfect outdoor space?\n\n#landscaping #outdoordesign #yardtransformation #gardendesign #outdoorliving`;
}
