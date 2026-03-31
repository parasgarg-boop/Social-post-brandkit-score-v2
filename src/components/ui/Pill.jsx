import { X } from 'lucide-react';
import T from '../../theme/tokens';

export default function Pill({ children, color = T.blue, bg = T.blueLt, onRemove, onClick, selected }) {
  return (
    <span onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 10px",
      borderRadius: "14px", fontSize: "12px", fontWeight: 500, color,
      background: selected ? color : bg,
      ...(selected && { color: T.white }),
      cursor: onClick ? "pointer" : "default", transition: "all 0.15s",
      border: onClick ? `1px solid ${selected ? color : "transparent"}` : "none",
    }}>
      {children}
      {onRemove && <X size={12} style={{ cursor: "pointer", marginLeft: "2px" }} onClick={(e) => { e.stopPropagation(); onRemove(); }} />}
    </span>
  );
}
