import { Plus, HelpCircle, Settings } from 'lucide-react';
import T from '../../theme/tokens';

export default function TopNav({ onSettings }) {
  return (
    <div style={{ height: "48px", background: T.white, borderBottom: `1px solid ${T.gray200}`, display: "flex", alignItems: "center", padding: "0 16px", zIndex: 30, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: 26, height: 26, borderRadius: "6px", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: T.white, fontSize: "15px", fontWeight: 800 }}>B</span>
        </div>
        <span style={{ fontSize: "15px", fontWeight: 600, color: T.gray800 }}>Social AI</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <button style={{ width: 28, height: 28, borderRadius: "50%", background: T.blue, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Plus size={14} color={T.white} /></button>
        <button style={{ width: 28, height: 28, borderRadius: "50%", background: T.gray100, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><HelpCircle size={14} color={T.gray500} /></button>
        <button onClick={onSettings} style={{ width: 28, height: 28, borderRadius: "50%", background: T.gray100, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Settings size={14} color={T.gray500} /></button>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: T.white, fontSize: "11px", fontWeight: 700 }}>PG</span>
        </div>
        <button style={{ width: 28, height: 28, borderRadius: "50%", background: T.gray100, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <div style={{ width: 14, height: 2, background: T.gray500, position: "relative" }}>
            <div style={{ width: 14, height: 2, background: T.gray500, position: "absolute", top: -5 }} />
            <div style={{ width: 14, height: 2, background: T.gray500, position: "absolute", top: 5 }} />
          </div>
        </button>
      </div>
    </div>
  );
}
