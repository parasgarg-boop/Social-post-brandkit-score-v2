import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50kb' }));

const PORT = process.env.PORT || 3001;
const DAILY_LIMIT = parseInt(process.env.DAILY_CALL_LIMIT || '50', 10);

// ── Daily usage tracker (in-memory, resets on restart or midnight) ──
let usageCount = 0;
let usageDate = new Date().toDateString();

function checkAndIncrementUsage() {
  const today = new Date().toDateString();
  if (today !== usageDate) {
    usageCount = 0;
    usageDate = today;
  }
  if (usageCount >= DAILY_LIMIT) {
    return false;
  }
  usageCount++;
  return true;
}

// ── Claude client ──
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Health check ──
app.get('/api/health', (req, res) => {
  const today = new Date().toDateString();
  if (today !== usageDate) { usageCount = 0; usageDate = today; }
  res.json({
    status: 'ok',
    usage: { used: usageCount, limit: DAILY_LIMIT, remaining: DAILY_LIMIT - usageCount },
    hasApiKey: process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your-key-here',
  });
});

// ── POST /api/score — Generate brand scores and suggestions ──
app.post('/api/score', async (req, res) => {
  if (!checkAndIncrementUsage()) {
    return res.status(429).json({
      error: 'daily_limit_exceeded',
      message: `Daily API limit of ${DAILY_LIMIT} calls reached. Try again tomorrow.`,
      usage: { used: usageCount, limit: DAILY_LIMIT, remaining: 0 },
    });
  }

  try {
    const { brand, channelContents, channels, criteria, mediaDescriptions } = req.body;

    const prompt = buildScoringPrompt({ brand, channelContents, channels, criteria, mediaDescriptions });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].text;
    const parsed = parseJSONFromResponse(text);

    res.json({
      ...parsed,
      usage: { used: usageCount, limit: DAILY_LIMIT, remaining: DAILY_LIMIT - usageCount },
    });
  } catch (err) {
    console.error('Score API error:', err.message);
    if (err.status === 401) {
      return res.status(401).json({ error: 'invalid_api_key', message: 'Invalid Anthropic API key. Check your server/.env file.' });
    }
    res.status(500).json({ error: 'api_error', message: err.message });
  }
});

// ── POST /api/improve-caption — Generate improved caption ──
app.post('/api/improve-caption', async (req, res) => {
  if (!checkAndIncrementUsage()) {
    return res.status(429).json({
      error: 'daily_limit_exceeded',
      message: `Daily API limit of ${DAILY_LIMIT} calls reached. Try again tomorrow.`,
      usage: { used: usageCount, limit: DAILY_LIMIT, remaining: 0 },
    });
  }

  try {
    const { currentContent, suggestion, channelName, brand, mediaDescriptions } = req.body;

    const prompt = buildImproveCaptionPrompt({ currentContent, suggestion, channelName, brand, mediaDescriptions });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].text;
    // Extract just the caption text (strip any markdown fencing)
    const caption = text.replace(/^```[\s\S]*?\n/, '').replace(/\n```$/, '').trim();

    res.json({
      caption,
      usage: { used: usageCount, limit: DAILY_LIMIT, remaining: DAILY_LIMIT - usageCount },
    });
  } catch (err) {
    console.error('Improve caption API error:', err.message);
    if (err.status === 401) {
      return res.status(401).json({ error: 'invalid_api_key', message: 'Invalid Anthropic API key. Check your server/.env file.' });
    }
    res.status(500).json({ error: 'api_error', message: err.message });
  }
});

// ── Prompt builders ──

function buildScoringPrompt({ brand, channelContents, channels, criteria, mediaDescriptions }) {
  const criteriaStr = criteria.filter(c => c.enabled).map(c => `- ${c.label} (${c.id}): weight ${c.weight}%`).join('\n');
  const channelContentStr = channels.map(ch =>
    `### ${ch}\n${channelContents[ch] || '(no content)'}`
  ).join('\n\n');
  const mediaStr = mediaDescriptions?.length > 0
    ? `Attached media: ${mediaDescriptions.join(', ')}`
    : 'No media attached.';

  return `You are a social media brand scoring expert. Analyze the following social media post content against the brand identity and scoring criteria.

## Brand Identity
- Name: ${brand.name}
- Personality: ${brand.voice?.personality?.join(', ') || 'N/A'}
- Tone: ${brand.voice?.tone?.join(', ') || 'N/A'}
- Brand Colors: Primary ${brand.kit?.colors?.primary || 'N/A'}, Secondary ${brand.kit?.colors?.secondary || 'N/A'}
- Fonts: ${brand.kit?.fonts?.header || 'N/A'}, ${brand.kit?.fonts?.body || 'N/A'}

## Scoring Criteria
${criteriaStr}

## Post Content (per channel)
${channelContentStr}

## Media
${mediaStr}

## Instructions
Score each criterion from 0-100 and provide actionable suggestions. Return ONLY valid JSON (no markdown fencing) in this exact format:
{
  "overall": <number 0-100>,
  "scores": {
    "voice": <number>,
    "media": <number>,
    "cta": <number>,
    "hashtags": <number>,
    "structure": <number>
  },
  "channelSuggestions": {
    "<channel_name>": [
      {
        "id": "<channel>-<dimension_initial>-<number>",
        "dimension": "<voice|media|cta|hashtags|structure>",
        "priority": "<high|medium|low|none>",
        "impact": <number 1-15>,
        "text": "<clear description of the issue or positive feedback>",
        "reasoning": "<why this matters, with data or best practices>",
        "action": "<specific action to take>",
        "example": "<concrete example of improved content>",
        "type": "<suggestion|positive>"
      }
    ]
  }
}

Rules:
- Score each dimension independently based on the criteria weight.
- Each channel should have 2-5 suggestions relevant to that platform's best practices.
- Include at least one "positive" type suggestion per channel for any dimension scoring 80+.
- For "positive" type: set priority to "none", impact to 0.
- Make suggestions channel-specific (e.g., Instagram vs LinkedIn best practices differ).
- The "example" field should contain actual rewritten content the user could use.
- Be specific and reference the actual post content in suggestions.`;
}

function buildImproveCaptionPrompt({ currentContent, suggestion, channelName, brand, mediaDescriptions }) {
  const mediaStr = mediaDescriptions?.length > 0
    ? `Attached media: ${mediaDescriptions.join(', ')}`
    : 'No media attached.';

  return `You are a social media copywriter. Improve the following caption for ${channelName} based on the suggestion provided.

## Brand Identity
- Name: ${brand.name}
- Personality: ${brand.voice?.personality?.join(', ') || 'N/A'}
- Tone: ${brand.voice?.tone?.join(', ') || 'N/A'}

## Current Caption
${currentContent}

## Media
${mediaStr}

## Suggestion to Address
- Issue: ${suggestion.text}
- Dimension: ${suggestion.dimension}
- Action: ${suggestion.action || 'Improve based on the issue described'}

## Instructions
Rewrite the COMPLETE caption for ${channelName}, incorporating the suggestion above. Keep the core message and brand voice intact.

Rules:
- Return ONLY the improved caption text, no explanations or labels.
- Maintain the brand's ${brand.voice?.personality?.[0] || 'professional'} personality and ${brand.voice?.tone?.[0] || 'engaging'} tone.
- Follow ${channelName} best practices (length, format, hashtag usage).
- Keep emojis if they fit the brand tone.
- If the suggestion is about CTAs, add a strong, specific call-to-action.
- If about hashtags, add appropriate hashtags for ${channelName}.
- If about structure, improve formatting with line breaks and scannable text.
- If about voice, make the opening more engaging and on-brand.`;
}

// ── JSON parser helper ──
function parseJSONFromResponse(text) {
  // Try direct parse
  try { return JSON.parse(text); } catch {}
  // Try extracting from markdown code blocks
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) { try { return JSON.parse(match[1]); } catch {} }
  // Try finding first { to last }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.substring(start, end + 1)); } catch {}
  }
  throw new Error('Failed to parse LLM response as JSON');
}

app.listen(PORT, () => {
  const hasKey = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your-key-here';
  console.log(`\n  🚀 Brand Score API running on http://localhost:${PORT}`);
  console.log(`  📊 Daily limit: ${DAILY_LIMIT} calls/day`);
  console.log(`  🔑 API key: ${hasKey ? 'configured ✓' : '⚠️  NOT SET — edit server/.env'}\n`);
});
