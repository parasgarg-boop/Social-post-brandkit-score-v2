import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import T from '../../theme/tokens';
import MediaPreviewGrid from './MediaPreviewGrid';

export default function FacebookPreview({ content, profile, brand, selectedMedia }) {
  return (
    <div style={{ border: `1px solid ${T.gray200}`, borderRadius: T.radius, overflow: "hidden" }}>
      <div style={{ padding: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: brand?.logoColor || T.gray300, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", overflow: "hidden" }}>
            {profile.avatar ? <img src={profile.avatar} style={{ width: "100%", height: "100%" }} /> : (brand?.logo || "?")}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: T.gray900 }}>{profile.name}</div>
            <div style={{ fontSize: "11px", color: T.gray500 }}>Just now</div>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: T.gray700, lineHeight: "20px", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {content.length > 400 ? content.substring(0, 400) + "..." : content}
        </p>
      </div>
      <MediaPreviewGrid selectedMedia={selectedMedia} brand={brand} />
      {/* Facebook reaction bar */}
      <div style={{ padding: "8px 14px", borderTop: `1px solid ${T.gray100}`, display: "flex", justifyContent: "space-around" }}>
        {[{ icon: ThumbsUp, label: "Like" }, { icon: MessageSquare, label: "Comment" }, { icon: Share2, label: "Share" }].map(a => (
          <div key={a.label} style={{ display: "flex", alignItems: "center", gap: "6px", color: T.gray500, fontSize: "12px", fontWeight: 500 }}>
            <a.icon size={14} /> {a.label}
          </div>
        ))}
      </div>
    </div>
  );
}
