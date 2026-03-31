import { useState, useEffect, useRef } from 'react';
import T from '../../theme/tokens';
import { EMOJI_CATEGORIES } from '../../data/emoji';

export default function EmojiPicker({ onSelect, onClose, anchorRef }) {
  const [activeCat, setActiveCat] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target) && anchorRef?.current && !anchorRef.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);
  return (
    <div ref={ref} style={{
      position: "absolute", bottom: "calc(100% + 8px)", left: 0, width: "320px", background: T.white,
      borderRadius: T.radius, boxShadow: T.shadowLg, border: `1px solid ${T.gray200}`, zIndex: 50, overflow: "hidden",
    }}>
      <div style={{ display: "flex", borderBottom: `1px solid ${T.gray100}`, padding: "6px 8px", gap: "2px" }}>
        {EMOJI_CATEGORIES.map((cat, i) => (
          <button key={cat.name} onClick={() => setActiveCat(i)} style={{
            flex: 1, padding: "5px 4px", fontSize: "11px", fontWeight: 500, borderRadius: "4px",
            background: activeCat === i ? T.blueLt : "transparent", color: activeCat === i ? T.blue : T.gray500,
            border: "none", cursor: "pointer",
          }}>{cat.name}</button>
        ))}
      </div>
      <div style={{ padding: "8px", height: "180px", overflow: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "2px" }}>
          {EMOJI_CATEGORIES[activeCat].emojis.map((em, i) => (
            <button key={i} onClick={() => onSelect(em)} style={{
              width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", background: "none", border: "none", borderRadius: "4px", cursor: "pointer",
            }}
              onMouseOver={e => e.currentTarget.style.background = T.gray100}
              onMouseOut={e => e.currentTarget.style.background = "none"}
            >{em}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
