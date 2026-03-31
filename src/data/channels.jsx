import React from 'react';
import T from '../theme/tokens';

export const CHANNEL_LIMITS = {
  facebook: { limit: 63206, label: "Facebook", warn: 0.95 },
  instagram: { limit: 2200, label: "Instagram", warn: 0.9 },
  linkedin: { limit: 3000, label: "LinkedIn", warn: 0.9 },
  twitter: { limit: 280, label: "Twitter/X", warn: 0.85 },
  google: { limit: 1500, label: "Google", warn: 0.9 },
  tiktok: { limit: 2200, label: "TikTok", warn: 0.9 },
};

export const CHANNEL_PROFILES = {
  facebook: { countLabel: "2 pages", getProfile: (loc) => ({ name: loc?.fbPage || "Your Page", avatar: loc?.fbAvatar }) },
  instagram: { countLabel: "1 profile", getProfile: (loc) => ({ name: loc?.igProfile || "your.profile", avatar: loc?.igAvatar }) },
  linkedin: { countLabel: "1 page", getProfile: (loc) => ({ name: loc?.liPage || "Your Company", avatar: loc?.liAvatar }) },
  twitter: { countLabel: "1 account", getProfile: (loc) => ({ name: loc?.twHandle || "@yourhandle", avatar: loc?.twAvatar }) },
  google: { countLabel: "1 listing", getProfile: (loc) => ({ name: loc?.fbPage || "Your Business", avatar: null }) },
  tiktok: { countLabel: "1 account", getProfile: (loc) => ({ name: loc?.igProfile || "your.profile", avatar: null }) },
};

export function ChannelIcon({ type, size = 16 }) {
  const colors = { facebook: "#1877F2", instagram: "#E4405F", linkedin: "#0A66C2", twitter: "#1DA1F2", google: "#4285F4", tiktok: "#010101" };
  const labels = { facebook: "f", instagram: "\u{1F4F7}", linkedin: "in", twitter: "\u{1D54F}", google: "G", tiktok: "\u266A" };
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: colors[type] || T.gray400, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ color: T.white, fontSize: size * 0.55, fontWeight: 700, lineHeight: 1 }}>{labels[type] || "?"}</span>
    </div>
  );
}
