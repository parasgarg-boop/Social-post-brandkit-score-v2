import { MessageSquare, Repeat, Heart, Share2 } from 'lucide-react';
import T from '../../theme/tokens';
import MediaPreviewGrid from './MediaPreviewGrid';

export default function TwitterPreview({ content, profile, brand, selectedMedia }) {
  return (
    <div style={{ border: `1px solid ${T.gray200}`, borderRadius: T.radius, overflow: "hidden", padding: "14px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: brand?.logoColor || T.gray300, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
          {brand?.logo || "?"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: T.gray900 }}>{profile.name.replace("@", "")}</span>
            <span style={{ fontSize: "12px", color: T.gray500 }}>{profile.name.startsWith("@") ? profile.name : ""}</span>
            <span style={{ fontSize: "12px", color: T.gray500 }}>{"\u00B7"} now</span>
          </div>
          <p style={{ fontSize: "13px", color: T.gray700, lineHeight: "20px", margin: "0 0 8px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {content.length > 280 ? content.substring(0, 280) + "..." : content}
          </p>
          {(selectedMedia.length > 0 || true) && (
            <div style={{ borderRadius: "12px", overflow: "hidden" }}>
              <MediaPreviewGrid selectedMedia={selectedMedia} brand={brand} />
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", maxWidth: "260px" }}>
            {[MessageSquare, Repeat, Heart, Share2].map((Ic, i) => (
              <Ic key={i} size={15} color={T.gray400} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
