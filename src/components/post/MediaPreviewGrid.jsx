import { Image, Monitor } from 'lucide-react';
import T from '../../theme/tokens';

export default function MediaPreviewGrid({ selectedMedia, brand }) {
  if (selectedMedia.length > 0) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: selectedMedia.length === 1 ? "1fr" : "1fr 1fr", gap: "2px" }}>
        {selectedMedia.slice(0, 4).map((img, i) => (
          <div key={img.id} style={{
            height: selectedMedia.length === 1 ? "160px" : "100px",
            background: img.isUpload ? T.gray200 : (img.gradient || T.gray200),
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            {img.isUpload ? (
              img.fileType === "video" ? <Monitor size={24} color={T.gray400} /> : <img src={img.dataUrl} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: selectedMedia.length === 1 ? "36px" : "24px" }}>{img.emoji}</span>
            )}
            {i === 3 && selectedMedia.length > 4 && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontSize: "18px", fontWeight: 700 }}>+{selectedMedia.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ height: "120px", background: `linear-gradient(135deg, ${brand?.kit?.colors?.primary || T.blue}, ${brand?.kit?.colors?.dark || T.gray800})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Image size={32} color="rgba(255,255,255,0.5)" />
    </div>
  );
}
