import { Heart, MessageSquare, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import T from '../../theme/tokens';
import MediaPreviewGrid from './MediaPreviewGrid';

export default function InstagramPreview({ content, profile, brand, selectedMedia }) {
  return (
    <div style={{ border: `1px solid ${T.gray200}`, borderRadius: T.radius, overflow: "hidden" }}>
      {/* IG header */}
      <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)`, padding: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
            {brand?.logo || "?"}
          </div>
        </div>
        <span style={{ fontSize: "13px", fontWeight: 600, color: T.gray900 }}>{profile.name}</span>
        <div style={{ flex: 1 }} />
        <MoreHorizontal size={16} color={T.gray500} />
      </div>
      {/* IG media (always shows) */}
      <MediaPreviewGrid selectedMedia={selectedMedia} brand={brand} />
      {/* IG action bar */}
      <div style={{ padding: "10px 14px 6px", display: "flex", gap: "14px", alignItems: "center" }}>
        <Heart size={20} color={T.gray800} />
        <MessageSquare size={20} color={T.gray800} />
        <Send size={20} color={T.gray800} />
        <div style={{ flex: 1 }} />
        <Bookmark size={20} color={T.gray800} />
      </div>
      {/* IG caption */}
      <div style={{ padding: "4px 14px 12px" }}>
        <p style={{ fontSize: "12px", color: T.gray700, lineHeight: "18px", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          <span style={{ fontWeight: 600, marginRight: "4px" }}>{profile.name}</span>
          {content.length > 300 ? content.substring(0, 300) + "..." : content}
        </p>
      </div>
    </div>
  );
}
