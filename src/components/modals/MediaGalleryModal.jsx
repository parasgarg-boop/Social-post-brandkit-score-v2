import { useState, useRef } from 'react';
import { X, Check, Search, Image, Upload, Monitor } from 'lucide-react';
import T from '../../theme/tokens';
import Btn from '../ui/Btn';
import { STOCK_IMAGES } from '../../data/media';

export default function MediaGalleryModal({ onSelect, onClose, selectedMedia, onUpload }) {
  const [search, setSearch] = useState("");
  const [galleryTab, setGalleryTab] = useState("stock");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const filtered = search ? STOCK_IMAGES.filter(img => img.label.toLowerCase().includes(search.toLowerCase())) : STOCK_IMAGES;
  const selectedIds = new Set(selectedMedia.map(m => m.id));

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpload({
          id: "upload-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
          label: file.name,
          dataUrl: e.target.result,
          isUpload: true,
          fileType: file.type.startsWith("video/") ? "video" : "image",
          fileSize: file.size,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const uploadedMedia = selectedMedia.filter(m => m.isUpload);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "600px", maxHeight: "82vh", background: T.white, borderRadius: T.radius, boxShadow: T.shadowLg, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.gray200}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "15px", fontWeight: 600, color: T.gray900 }}>Media Gallery</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={T.gray500} /></button>
        </div>

        {/* Tabs: Stock / Upload */}
        <div style={{ display: "flex", borderBottom: `2px solid ${T.gray200}`, padding: "0 20px" }}>
          {[{ key: "stock", label: "Stock Images", icon: Image }, { key: "upload", label: "Upload from Computer", icon: Upload }].map(tab => (
            <button key={tab.key} onClick={() => setGalleryTab(tab.key)} style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", fontSize: "13px", fontWeight: galleryTab === tab.key ? 600 : 400,
              color: galleryTab === tab.key ? T.blue : T.gray500, background: "none", border: "none",
              borderBottom: galleryTab === tab.key ? `2px solid ${T.blue}` : "2px solid transparent",
              cursor: "pointer", marginBottom: "-2px",
            }}>
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stock images tab */}
        {galleryTab === "stock" && (
          <>
            <div style={{ padding: "12px 20px", borderBottom: `1px solid ${T.gray100}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", background: T.gray50, borderRadius: T.radiusSm, border: `1px solid ${T.gray200}` }}>
                <Search size={15} color={T.gray400} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search images..." style={{ border: "none", outline: "none", background: "none", fontSize: "13px", flex: 1, fontFamily: T.font }} />
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                {filtered.map(img => (
                  <button key={img.id} onClick={() => onSelect(img)} style={{
                    position: "relative", aspectRatio: "1", borderRadius: T.radiusSm, background: img.gradient,
                    border: selectedIds.has(img.id) ? `3px solid ${T.blue}` : `2px solid transparent`,
                    cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px",
                    transition: "transform 0.15s", overflow: "hidden",
                  }}
                    onMouseOver={e => e.currentTarget.style.transform = "scale(1.04)"}
                    onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <span style={{ fontSize: "28px" }}>{img.emoji}</span>
                    <span style={{ fontSize: "10px", color: "white", fontWeight: 600, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{img.label}</span>
                    {selectedIds.has(img.id) && (
                      <div style={{ position: "absolute", top: "6px", right: "6px", width: 20, height: 20, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={12} color="white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Upload tab */}
        {galleryTab === "upload" && (
          <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
            {/* Drop zone */}
            <div
              onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? T.blue : T.gray300}`,
                borderRadius: T.radius, padding: "40px 20px", textAlign: "center", cursor: "pointer",
                background: dragOver ? T.blueLt : T.gray50, transition: "all 0.2s",
                marginBottom: uploadedMedia.length > 0 ? "16px" : "0",
              }}
              onMouseOver={e => { if (!dragOver) e.currentTarget.style.borderColor = T.blue; }}
              onMouseOut={e => { if (!dragOver) e.currentTarget.style.borderColor = T.gray300; }}
            >
              <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple
                style={{ display: "none" }}
                onChange={e => { handleFiles(e.target.files); e.target.value = ""; }}
              />
              <Upload size={32} color={dragOver ? T.blue : T.gray400} />
              <p style={{ fontSize: "14px", fontWeight: 500, color: T.gray700, margin: "12px 0 4px" }}>
                {dragOver ? "Drop files here" : "Click to upload or drag & drop"}
              </p>
              <p style={{ fontSize: "12px", color: T.gray500, margin: 0 }}>
                Supports JPG, PNG, GIF, SVG, MP4, MOV
              </p>
            </div>

            {/* Uploaded files grid */}
            {uploadedMedia.length > 0 && (
              <>
                <div style={{ fontSize: "12px", fontWeight: 600, color: T.gray600, marginBottom: "10px" }}>
                  Uploaded ({uploadedMedia.length})
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  {uploadedMedia.map(img => (
                    <div key={img.id} style={{
                      position: "relative", aspectRatio: "1", borderRadius: T.radiusSm, overflow: "hidden",
                      border: `2px solid ${T.blue}`,
                    }}>
                      {img.fileType === "video" ? (
                        <div style={{ width: "100%", height: "100%", background: T.gray800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Monitor size={24} color={T.gray400} />
                        </div>
                      ) : (
                        <img src={img.dataUrl} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                      <button onClick={(e) => { e.stopPropagation(); onSelect(img); }} style={{
                        position: "absolute", top: "4px", right: "4px", width: 20, height: 20, borderRadius: "50%",
                        background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center", padding: 0,
                      }}>
                        <X size={10} color="white" />
                      </button>
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 6px",
                        background: "rgba(0,0,0,0.6)", fontSize: "9px", color: "white", whiteSpace: "nowrap",
                        overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {img.label}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.gray200}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: T.gray500 }}>{selectedMedia.length} item{selectedMedia.length !== 1 ? "s" : ""} selected</span>
          <Btn variant="primary" onClick={onClose}>Done</Btn>
        </div>
      </div>
    </div>
  );
}
