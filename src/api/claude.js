const API_BASE = 'http://localhost:3001/api';

// Track latest usage info from server responses
let _lastUsage = null;
export function getLastUsage() { return _lastUsage; }

async function apiCall(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (data.usage) _lastUsage = data.usage;

  if (!res.ok) {
    const err = new Error(data.message || 'API request failed');
    err.code = data.error; // 'daily_limit_exceeded' | 'invalid_api_key' | 'api_error'
    err.usage = data.usage;
    throw err;
  }

  return data;
}

/**
 * Score post content against brand identity via Claude API.
 * Returns: { overall, scores, channelSuggestions, usage }
 */
export async function scorePost({ brand, channelContents, channels, criteria, media }) {
  const mediaDescriptions = (media || []).map(m =>
    m.isUpload ? `Uploaded ${m.fileType || 'image'}: ${m.label || 'custom file'}` : `Stock image: ${m.label || 'unnamed'}`
  );

  const data = await apiCall('/score', {
    brand: {
      name: brand.name,
      voice: brand.voice,
      kit: brand.kit,
    },
    channelContents,
    channels,
    criteria,
    mediaDescriptions,
  });

  // Normalize: ensure each suggestion has required fields
  if (data.channelSuggestions) {
    let _sid = 0;
    for (const ch of Object.keys(data.channelSuggestions)) {
      data.channelSuggestions[ch] = (data.channelSuggestions[ch] || []).map(s => ({
        id: s.id || `${ch}-${s.dimension?.[0] || 'x'}-${++_sid}`,
        dimension: s.dimension || 'voice',
        priority: s.priority || 'medium',
        impact: s.impact || 5,
        text: s.text || '',
        reasoning: s.reasoning || '',
        action: s.action || '',
        example: s.example || '',
        type: s.type === 'positive' ? 'positive' : undefined,
      }));
    }
  }

  return {
    overall: data.overall || 50,
    scores: data.scores || {},
    channelSuggestions: data.channelSuggestions || {},
    analyzedAt: new Date().toLocaleTimeString(),
    usage: data.usage,
  };
}

/**
 * Improve a caption for a specific channel via Claude API.
 * Returns: { caption, usage }
 */
export async function improveCaption({ currentContent, suggestion, channelName, brand, media }) {
  const mediaDescriptions = (media || []).map(m =>
    m.isUpload ? `Uploaded ${m.fileType || 'image'}: ${m.label || 'custom file'}` : `Stock image: ${m.label || 'unnamed'}`
  );

  const data = await apiCall('/improve-caption', {
    currentContent,
    suggestion: {
      text: suggestion.text,
      dimension: suggestion.dimension,
      action: suggestion.action,
    },
    channelName,
    brand: {
      name: brand.name,
      voice: brand.voice,
      kit: brand.kit,
    },
    mediaDescriptions,
  });

  return {
    caption: data.caption,
    usage: data.usage,
  };
}

/**
 * Check if the backend is reachable and has a valid API key.
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch {
    return { status: 'unreachable', hasApiKey: false, usage: null };
  }
}
