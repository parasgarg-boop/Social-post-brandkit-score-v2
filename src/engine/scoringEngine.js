import T from '../theme/tokens';

export function generateScores(brand, postContent, channels, criteria, selectedMedia) {
  const content = postContent || "";
  const media = selectedMedia || [];
  const words = content.split(/\s+/).filter(Boolean);
  const hasEmoji = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(content);
  const hashtagList = content.match(/#\w+/g) || [];
  const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim()).length;
  const avgWordLen = words.length ? words.reduce((a, w) => a + w.length, 0) / words.length : 0;
  const brandName = brand.name.toLowerCase();
  const brandKeywords = brand.name.toLowerCase().split(/\s+/);
  const contentLower = content.toLowerCase();
  const hasLink = content.includes("http") || content.includes("www") || content.includes(".com");
  const hasQuestion = /\?/.test(content);
  const lineBreaks = (content.match(/\n/g) || []).length;

  /* ── Media-caption relevance analysis ── */
  const hasMedia = media.length > 0;
  const uploadedMedia = media.filter(m => m.isUpload);
  const stockMedia = media.filter(m => !m.isUpload);
  const mediaLabels = media.map(m => (m.label || "").toLowerCase()).join(" ");

  // Extract topic keywords from caption (words > 3 chars, excluding common words)
  const stopWords = new Set(["the","and","for","are","but","not","you","all","can","had","her","was","one","our","out","has","have","from","with","they","been","this","that","will","each","make","like","just","over","such","take","than","them","very","some","into","most","other","more","about","your","also","come","keep","made","what","when","where","which","their","would","there","could","after","every","first","then","these","those","still","being","here","does","doing"]);
  const topicWords = words.filter(w => w.length > 3 && !stopWords.has(w.toLowerCase().replace(/[^a-z]/g, ""))).map(w => w.toLowerCase().replace(/[^a-z]/g, "")).filter(Boolean);

  // Check media-caption alignment by topic overlap
  const mediaTopicOverlap = hasMedia ? topicWords.filter(w => mediaLabels.includes(w)).length : 0;
  const mediaRelevanceRatio = topicWords.length > 0 ? mediaTopicOverlap / Math.min(topicWords.length, 5) : 0;

  /* ── 1. Brand Voice & Tone scoring ── */
  let voiceScore = 40;
  // Content substance
  if (content.length > 50) voiceScore += 8;
  if (content.length > 150) voiceScore += 5;
  if (sentenceCount >= 2) voiceScore += 6;
  if (sentenceCount >= 3 && sentenceCount <= 6) voiceScore += 4;
  // Conversational & engaging signals
  if (hasQuestion) voiceScore += 6;
  if (hasEmoji) voiceScore += 4;
  if (avgWordLen < 6.5) voiceScore += 5; // accessible language
  if (avgWordLen > 8) voiceScore -= 5; // overly complex
  // Brand name mention
  if (contentLower.includes(brandName)) voiceScore += 5;
  // Personality alignment — check if content reflects stated personality
  const personalityKeywordMap = {
    "Warm": ["love","heart","care","happy","joy","comfort","cozy","welcome"],
    "Expert": ["proven","research","data","insight","strategy","expertise","professional"],
    "Playful": ["fun","amazing","awesome","wow","excited","love","enjoy"],
    "Bold": ["powerful","strong","bold","fearless","unstoppable","dare","epic"],
    "Friendly": ["hey","hi","friend","together","community","join","welcome"],
    "Sophisticated": ["elegant","refined","luxury","premium","exclusive","curated"],
    "Approachable": ["easy","simple","just","try","come","welcome","everyone"],
    "Local-focused": ["neighborhood","local","community","near","town","here"],
    "Innovative": ["new","cutting-edge","revolutionary","breakthrough","transform","future"],
  };
  let personalityMatch = 0;
  brand.voice.personality.forEach(p => {
    const kws = personalityKeywordMap[p] || [];
    if (kws.some(k => contentLower.includes(k))) personalityMatch++;
  });
  voiceScore += Math.min(12, personalityMatch * 6);
  voiceScore = Math.min(95, voiceScore + Math.floor(Math.random() * 5));

  /* ── 2. Media & Caption Relevance scoring ── */
  let mediaScore = 30;
  if (hasMedia) {
    mediaScore += 20; // has media attached
    if (uploadedMedia.length > 0) mediaScore += 8; // custom media > stock
    if (mediaRelevanceRatio > 0.3) mediaScore += 12; // media labels match caption topics
    else if (mediaRelevanceRatio > 0) mediaScore += 6;
    if (media.length >= 2 && media.length <= 4) mediaScore += 5; // multi-image carousel
    if (media.length > 6) mediaScore -= 5; // too many images
    // Brand color alignment for stock images
    if (stockMedia.length > 0) mediaScore += 3;
    if (uploadedMedia.length > 0) mediaScore += 5; // real brand content
  } else {
    // No media — caption-first workflow, but media is important
    if (content.length > 100) mediaScore += 10; // at least has substantial caption
  }
  mediaScore = Math.min(95, mediaScore + Math.floor(Math.random() * 5));

  /* ── 3. Engagement & CTA scoring ── */
  let ctaScore = 30;
  const strongCTAs = ["shop now","book now","sign up","get started","learn more","discover","explore","try now","order now","subscribe"];
  const softCTAs = ["visit","check","see","read","come","join","follow","share","tag","click","tap","swipe"];
  const hasStrongCTA = strongCTAs.some(c => contentLower.includes(c));
  const hasSoftCTA = softCTAs.some(c => contentLower.includes(c));
  if (hasStrongCTA) ctaScore += 20;
  else if (hasSoftCTA) ctaScore += 12;
  if (hasLink) ctaScore += 10;
  if (hasQuestion) ctaScore += 8; // questions drive engagement
  if (contentLower.includes("comment") || contentLower.includes("tell us") || contentLower.includes("what do you")) ctaScore += 8;
  if (hasEmoji) ctaScore += 3;
  // Urgency/scarcity signals
  if (contentLower.includes("limited") || contentLower.includes("today") || contentLower.includes("now") || contentLower.includes("don't miss")) ctaScore += 5;
  ctaScore = Math.min(95, ctaScore + Math.floor(Math.random() * 8));

  /* ── 4. Hashtags & Keywords scoring ── */
  let hashScore = 35;
  const hasBrandTag = hashtagList.some(h => h.toLowerCase().includes(brandKeywords[0]));
  if (hashtagList.length > 0) hashScore += 12;
  if (hashtagList.length >= 3 && hashtagList.length <= 15) hashScore += 10;
  if (hasBrandTag) hashScore += 15;
  // Industry keyword presence
  if (brandKeywords.some(k => hashtagList.some(h => h.toLowerCase().includes(k)))) hashScore += 8;
  // Penalize extremes
  if (hashtagList.length > 20) hashScore -= 10;
  if (hashtagList.length === 0) hashScore -= 5;
  hashScore = Math.min(95, hashScore + Math.floor(Math.random() * 8));

  /* ── 5. Content Structure scoring ── */
  let structScore = 35;
  // Length appropriateness (general social media sweet spot: 40-200 words)
  if (words.length >= 20 && words.length <= 250) structScore += 12;
  if (words.length >= 40 && words.length <= 150) structScore += 5; // ideal range
  if (words.length < 10) structScore -= 5;
  if (words.length > 300) structScore -= 8;
  // Sentence variety
  if (sentenceCount >= 2 && sentenceCount <= 8) structScore += 8;
  if (sentenceCount === 1 && words.length > 30) structScore -= 5;
  // Readability
  if (avgWordLen >= 4 && avgWordLen <= 7) structScore += 5;
  // Emoji usage (moderate is good)
  if (hasEmoji) structScore += 5;
  // Line breaks / paragraph structure
  if (lineBreaks >= 1 && lineBreaks <= 5) structScore += 5;
  if (lineBreaks > 8) structScore -= 3;
  // Not all caps
  const capsRatio = content.replace(/[^A-Za-z]/g, "").length > 0 ? (content.replace(/[^A-Z]/g, "").length / content.replace(/[^A-Za-z]/g, "").length) : 0;
  if (capsRatio > 0.5) structScore -= 8;
  structScore = Math.min(95, structScore + Math.floor(Math.random() * 8));

  const scores = { voice: voiceScore, media: mediaScore, cta: ctaScore, hashtags: hashScore, structure: structScore };
  const enabledCriteria = criteria.filter(c => c.enabled);
  const totalWeight = enabledCriteria.reduce((a, c) => a + c.weight, 0);
  const overall = Math.round(enabledCriteria.reduce((a, c) => a + (scores[c.id] || 50) * (c.weight / totalWeight), 0));

  // Content-aware snippet extraction
  const firstSentence = content.split(/[.!?]/)[0]?.trim().substring(0, 60) || "your opening line";
  const lastSentence = content.split(/[.!?]/).filter(s => s.trim()).pop()?.trim().substring(0, 60) || "your closing line";

  // Build per-channel suggestions
  const channelSuggestions = {};
  const activeChannels = channels.length > 0 ? channels : ["facebook"];
  let _sid = 0; // global unique suggestion counter
  const _id = (ch, prefix) => `${ch}-${prefix}-${++_sid}`;

  activeChannels.forEach(ch => {
    channelSuggestions[ch] = [];

    /* ── Voice suggestions ── */
    if (scores.voice < 80) {
      if (ch === "facebook") {
        channelSuggestions[ch].push({
          id: _id(ch, "v"), dimension: "voice", priority: "high", impact: 8,
          text: `Facebook audiences respond best to conversational, story-driven posts. "${firstSentence}..." could be more engaging.`,
          reasoning: `Your brand personality is "${brand.voice.personality.join(", ")}" but the opening feels generic. Facebook's algorithm favors posts that generate comments — questions and personal anecdotes drive 2-3x more engagement.`,
          action: "Rewrite the opening as a question or personal story hook",
          example: `Instead of "${firstSentence}...", try: "Ever wondered what makes the perfect [topic]? Here's what we've learned..."`,
        });
      }
      if (ch === "instagram") {
        channelSuggestions[ch].push({
          id: _id(ch, "v"), dimension: "voice", priority: "high", impact: 9,
          text: `Instagram captions should lead with a hook in the first line (before "...more"). "${firstSentence}..." may get cut off.`,
          reasoning: `Instagram truncates captions after ~125 characters. Your brand tone is "${brand.voice.tone.join(", ")}" — lead with the most compelling statement to stop the scroll.`,
          action: "Front-load the caption with an attention-grabbing first line",
          example: `Lead with something punchy like: "This changes everything \u{1F447}" or a bold brand statement.`,
        });
      }
      if (ch === "linkedin") {
        channelSuggestions[ch].push({
          id: _id(ch, "v"), dimension: "voice", priority: "medium", impact: 6,
          text: `LinkedIn favors thought leadership and value-driven content. The tone could be more authoritative.`,
          reasoning: `Your brand personality includes "${brand.voice.personality[0]}" — on LinkedIn, framing insights as expertise drives higher engagement. Posts with data or specific takeaways get 3x more shares.`,
          action: "Add a specific insight, statistic, or professional takeaway",
          example: `Add a line like: "Here's what 10 years in [industry] taught us about [topic]..."`,
        });
      }
    }
    if (!hasQuestion && scores.voice < 90) {
      channelSuggestions[ch].push({
        id: _id(ch, "v"), dimension: "voice", priority: "medium", impact: 5,
        text: "Adding a question increases engagement by inviting audience participation.",
        reasoning: `Posts with questions generate 2x more comments. For a "${brand.voice.personality[0]}" brand, this feels natural and on-brand.`,
        action: "Add a question to encourage comments and discussion",
        example: `Try ending with: "What's your favorite [topic]?" or "Have you tried this yet?"`,
      });
    }

    /* ── Media & Caption Relevance suggestions ── */
    if (!hasMedia) {
      channelSuggestions[ch].push({
        id: _id(ch, "mr"), dimension: "media", priority: "high", impact: 15,
        text: "No media attached — posts with images get 2.3x more engagement than text-only posts.",
        reasoning: `Whether you start with a caption idea or a visual, pairing both creates significantly stronger posts. ${ch === "instagram" ? "Instagram is visual-first — a post without media won't perform." : "Even on text-friendly platforms, visuals stop the scroll."}`,
        action: ch === "instagram" ? "Add at least one high-quality image or video" : "Attach a relevant image, video, or graphic to boost visibility",
        example: `Add media that directly illustrates your caption about "${topicWords.slice(0, 3).join(", ") || "your topic"}"`,
      });
    }
    if (hasMedia && mediaRelevanceRatio < 0.2) {
      channelSuggestions[ch].push({
        id: _id(ch, "mr"), dimension: "media", priority: "high", impact: 10,
        text: `Media doesn't appear to match the caption context. Your caption discusses "${topicWords.slice(0, 3).join(", ") || "your topic"}" but the media may not reflect this.`,
        reasoning: `Caption-media mismatch confuses the audience and reduces trust. Whether you wrote the caption first or chose the image first, both should tell the same story. Aligned media-caption posts see 45% higher engagement.`,
        action: "Swap the media to match your caption, or adjust the caption to match the visual",
        example: content.length > 50 ? `If your caption talks about "${topicWords[0] || "your topic"}", your image should visually reinforce that theme.` : "Write a caption that describes or complements what's shown in your media.",
      });
    }
    if (hasMedia && scores.media < 80) {
      channelSuggestions[ch].push({
        id: _id(ch, "mr"), dimension: "media", priority: "medium", impact: 6,
        text: `Ensure media uses brand colors (${brand.kit.colors.primary}, ${brand.kit.colors.secondary}) for visual consistency.`,
        reasoning: `Your brand kit defines specific colors and "${brand.kit.fonts.header}" typography. Consistent visual branding across posts increases brand recognition by up to 80%.`,
        action: "Apply brand-colored overlay, frame, or ensure media features brand colors",
      });
      if (ch === "instagram") {
        channelSuggestions[ch].push({
          id: _id(ch, "mr"), dimension: "media", priority: "medium", impact: 5,
          text: "Instagram carousel posts (2-5 images) get 3x more engagement than single images.",
          reasoning: `Carousels increase time-on-post and get re-shown by the algorithm. A story arc across slides keeps users swiping.`,
          action: "Consider adding 2-5 related images to create a carousel post",
        });
      }
    }
    if (hasMedia && uploadedMedia.length === 0 && stockMedia.length > 0) {
      channelSuggestions[ch].push({
        id: _id(ch, "mr"), dimension: "media", priority: "low", impact: 3,
        text: "Using stock/sample images — original brand photography performs 35% better.",
        reasoning: "Authentic, original content builds trust and brand identity better than generic stock imagery. Audiences can spot stock photos and engage less.",
        action: "Replace stock images with original brand photography when possible",
      });
    }

    /* ── Engagement & CTA suggestions ── */
    if (scores.cta < 80) {
      const foundCTA = strongCTAs.find(c => contentLower.includes(c)) || softCTAs.find(c => contentLower.includes(c));
      if (!foundCTA) {
        channelSuggestions[ch].push({
          id: _id(ch, "c"), dimension: "cta", priority: "high", impact: 12,
          text: `No clear call-to-action detected. "${lastSentence}..." ends without directing the reader.`,
          reasoning: `Every post should guide the reader to a next step. For a "${brand.voice.personality[0]}" brand, the CTA should feel like a natural invitation, not a hard sell. Posts with CTAs drive 3x more clicks.`,
          action: "Add a clear, on-brand call-to-action",
          example: ch === "instagram" ? "'Link in bio for more \u{1F446}' or 'Double tap if you agree \u2764\uFE0F'" : ch === "facebook" ? `"Ready to experience ${brand.name}? [Link] \u{1F517}"` : `"Want to learn how? Read our latest insights \u2192 [Link]"`,
        });
      } else if (hasStrongCTA) {
        channelSuggestions[ch].push({
          id: _id(ch, "c"), dimension: "cta", priority: "low", impact: 3,
          text: `Good CTA detected ("${foundCTA}") — consider A/B testing with a brand-voice variant for better conversion.`,
          reasoning: `Brand-specific CTAs outperform generic ones by 2x. Your "${brand.voice.tone[0]}" tone suggests a ${brand.voice.tone[0].toLowerCase()} approach would resonate better.`,
          action: "Test a brand-voice-aligned CTA variant",
        });
      } else {
        channelSuggestions[ch].push({
          id: _id(ch, "c"), dimension: "cta", priority: "medium", impact: 7,
          text: `Soft CTA detected ("${foundCTA}") — upgrading to a specific action increases conversion 2-3x.`,
          reasoning: `Vague CTAs like "visit" or "check" don't create urgency. Replace with specific, action-oriented language that matches your "${brand.voice.tone[0]}" tone.`,
          action: "Replace with a specific, action-oriented CTA",
          example: `Instead of "${foundCTA}", try: "Shop the collection \u2192" or "Book your free consultation today"`,
        });
      }
    }
    if (!hasLink && ch !== "instagram") {
      channelSuggestions[ch].push({
        id: _id(ch, "c"), dimension: "cta", priority: "medium", impact: 5,
        text: `No link detected — ${ch === "linkedin" ? "LinkedIn posts with links drive traffic but may get less reach" : "adding a link gives readers a clear next step"}.`,
        reasoning: ch === "linkedin" ? "LinkedIn sometimes de-prioritizes posts with links in the algorithm. Consider putting the link in the first comment instead." : "A trackable link helps measure post ROI and drives traffic to your owned properties.",
        action: ch === "linkedin" ? "Add link in the first comment, or use LinkedIn's native article feature" : "Add a relevant link to drive traffic",
      });
    }

    /* ── Hashtags & Keywords suggestions ── */
    if (scores.hashtags < 80) {
      const brandHashtag = `#${brand.name.replace(/\s+/g, "")}`;
      const hasBrandTag = hashtagList.some(h => h.toLowerCase().includes(brandKeywords[0]));
      if (!hasBrandTag) {
        channelSuggestions[ch].push({
          id: _id(ch, "h"), dimension: "hashtags", priority: "medium", impact: 6,
          text: `Missing branded hashtag — add "${brandHashtag}" for brand recall and tracking.`,
          reasoning: `Branded hashtags create a searchable content library and help track UGC. Users who search "${brandHashtag}" see all your posts in one place.`,
          action: `Add ${brandHashtag} to your hashtag set`,
        });
      }
      if (ch === "instagram" && hashtagList.length < 5) {
        channelSuggestions[ch].push({
          id: _id(ch, "h"), dimension: "hashtags", priority: "medium", impact: 7,
          text: `Only ${hashtagList.length} hashtags — Instagram posts perform best with 5-15 relevant hashtags.`,
          reasoning: `Instagram's algorithm uses hashtags for discovery. Mix branded tags, industry tags, and niche community tags. Posts with 11+ targeted hashtags get 79% more engagement.`,
          action: "Add a mix of branded, industry, and niche hashtags (aim for 8-15 total)",
        });
      }
      if (ch === "linkedin") {
        if (hashtagList.length > 5) {
          channelSuggestions[ch].push({
            id: _id(ch, "h"), dimension: "hashtags", priority: "low", impact: 3,
            text: `${hashtagList.length} hashtags is too many for LinkedIn — stick to 3-5 highly relevant ones.`,
            reasoning: `LinkedIn's algorithm may flag posts with excessive hashtags as spammy. Focus on 3-5 industry-specific tags your target audience follows.`,
            action: "Reduce to 3-5 targeted professional hashtags",
          });
        } else if (hashtagList.length === 0) {
          channelSuggestions[ch].push({
            id: _id(ch, "h"), dimension: "hashtags", priority: "medium", impact: 5,
            text: "No hashtags on LinkedIn — adding 3-5 relevant ones boosts discoverability.",
            reasoning: "LinkedIn hashtags help your content surface in topic feeds. Industry-specific tags connect you with your professional audience.",
            action: "Add 3-5 industry and topic hashtags",
          });
        }
      }
      if (ch === "facebook" && hashtagList.length > 3) {
        channelSuggestions[ch].push({
          id: _id(ch, "h"), dimension: "hashtags", priority: "low", impact: 2,
          text: `Facebook posts don't benefit much from heavy hashtag use. Keep to 1-3 max.`,
          reasoning: "Unlike Instagram, Facebook's algorithm doesn't heavily weight hashtags for discovery. Too many hashtags look spammy and reduce perceived quality.",
          action: "Reduce to 1-3 focused hashtags or remove entirely",
        });
      }
    }

    /* ── Content Structure suggestions ── */
    const channelLengths = { facebook: { min: 40, max: 100, name: "40-100" }, instagram: { min: 30, max: 150, name: "30-150" }, linkedin: { min: 50, max: 200, name: "50-200" }, twitter: { min: 5, max: 45, name: "5-45" } };
    const ideal = channelLengths[ch] || { min: 30, max: 150, name: "30-150" };
    if (words.length > ideal.max) {
      channelSuggestions[ch].push({
        id: _id(ch, "s"), dimension: "structure", priority: ch === "twitter" ? "high" : "medium", impact: ch === "twitter" ? 10 : 5,
        text: `At ${words.length} words, this post is long for ${ch}. Optimal length is ${ideal.name} words.`,
        reasoning: ch === "twitter" ? "X/Twitter's 280-character limit means ruthless editing. Distill to your single strongest statement." : `${ch === "facebook" ? "Facebook's 'See more' truncation kicks in around 480 characters." : ch === "linkedin" ? "LinkedIn shows ~210 characters before truncation on mobile." : "Shorter captions often outperform longer ones."} Trim to the most impactful message.`,
        action: `Trim to ${ideal.name} words for ${ch}`,
      });
    }
    if (words.length < ideal.min && words.length > 0) {
      channelSuggestions[ch].push({
        id: _id(ch, "s"), dimension: "structure", priority: "medium", impact: 4,
        text: `At ${words.length} words, this caption may be too brief for ${ch}. Aim for ${ideal.name} words.`,
        reasoning: `Very short captions lack context and don't give the algorithm enough signal to categorize your content. Add value, context, or a story to increase engagement.`,
        action: `Expand the caption to at least ${ideal.min} words with relevant context`,
      });
    }
    if (sentenceCount === 1 && words.length > 25) {
      channelSuggestions[ch].push({
        id: _id(ch, "s"), dimension: "structure", priority: "medium", impact: 4,
        text: "Single run-on sentence detected — breaking into 2-3 sentences improves readability.",
        reasoning: "Social media users scan content quickly. Shorter sentences with clear breaks improve comprehension and keep readers engaged.",
        action: "Break into 2-3 shorter sentences with a clear flow",
      });
    }
    if (lineBreaks === 0 && words.length > 50) {
      channelSuggestions[ch].push({
        id: _id(ch, "s"), dimension: "structure", priority: "low", impact: 3,
        text: "No line breaks — adding whitespace between ideas improves scannability.",
        reasoning: "Wall-of-text posts get scrolled past. Use line breaks to create visual breathing room, especially on mobile where screen width is narrow.",
        action: "Add line breaks between key ideas or after the hook",
      });
    }
    if (capsRatio > 0.5 && content.length > 20) {
      channelSuggestions[ch].push({
        id: _id(ch, "s"), dimension: "structure", priority: "medium", impact: 5,
        text: "Excessive use of ALL CAPS — this reads as shouting and reduces credibility.",
        reasoning: "All-caps text is harder to read and feels aggressive. Most platforms' algorithms may also down-rank all-caps content.",
        action: "Use sentence case and save caps for 1-2 key emphasis words at most",
      });
    }
    if (!hasEmoji && (ch === "facebook" || ch === "instagram")) {
      channelSuggestions[ch].push({
        id: _id(ch, "s"), dimension: "structure", priority: "low", impact: 2,
        text: `No emojis used — moderate emoji usage increases engagement on ${ch} by ~15%.`,
        reasoning: `Emojis add personality and visual breaks. For a "${brand.voice.personality[0]}" brand, 2-3 relevant emojis complement the tone without looking unprofessional.`,
        action: "Add 2-3 relevant emojis to highlight key points or emotions",
      });
    }

    /* ── Positive feedback ── */
    if (scores.voice >= 80) {
      channelSuggestions[ch].push({
        id: _id(ch, "pos"), dimension: "voice", priority: "none", impact: 0,
        text: `Strong brand voice — the "${brand.voice.personality[0]}" personality comes through clearly.`,
        reasoning: `The language, sentence structure, and emotional tone closely match your brand voice guidelines.`,
        type: "positive",
      });
    }
    if (scores.media >= 80 && hasMedia) {
      channelSuggestions[ch].push({
        id: _id(ch, "pos"), dimension: "media", priority: "none", impact: 0,
        text: `Good media-caption alignment — the visual supports the written message.`,
        reasoning: `Media and caption work together to tell a cohesive brand story. ${uploadedMedia.length > 0 ? "Original brand photography adds authenticity." : ""}`,
        type: "positive",
      });
    }
    if (scores.structure >= 80) {
      channelSuggestions[ch].push({
        id: _id(ch, "pos"), dimension: "structure", priority: "none", impact: 0,
        text: `Well-structured content — good length and readability for ${ch}.`,
        reasoning: `Post length, formatting, and readability are optimized for this channel's audience expectations.`,
        type: "positive",
      });
    }
  });

  return {
    overall,
    scores,
    channelSuggestions,
    analyzedAt: new Date().toLocaleTimeString(),
  };
}
