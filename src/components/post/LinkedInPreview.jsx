import { ThumbsUp, MessageSquare, Repeat, Send } from 'lucide-react';
import T from '../../theme/tokens';
import MediaPreviewGrid from './MediaPreviewGrid';

export default function LinkedInPreview({ content, profile, brand, selectedMedia }) {
  return (
    <div style={{ border: `1px solid ${T.gray200}`, borderRadius: T.radius, overflow: "hidden" }}>
      <div style={{ padding: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <div style={{ width: 40, height: 40, borderRadius: "4px", background: brand?.logoColor || "#0A66C2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: T.white, fontWeight: 700 }}>
            {profile.avatar ? <img src={profile.avatar} style={{ width: "100%", height: "100%" }} /> : (brand?.logo ? <span>{brand.logo}</span> : profile.name.charAt(0).toUpperCase())}
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
      {/* LinkedIn reaction bar */}
      <div style={{ padding: "8px 14px", borderTop: `1px solid ${T.gray100}`, display: "flex", justifyContent: "space-around" }}>
        {[{ icon: ThumbsUp, label: "Like" }, { icon: MessageSquare, label: "Comment" }, { icon: Repeat, label: "Repost" }, { icon: Send, label: "Send" }].map(a => (
          <div key={a.label} style={{ display: "flex", alignItems: "center", gap: "5px", color: T.gray500, fontSize: "12px", fontWeight: 500 }}>
            <a.icon size={14} /> {a.label}
          </div>
        ))}
      </div>
    </div>
  );
}
