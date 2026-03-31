import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import T from '../../theme/tokens';
import Btn from '../ui/Btn';

export default function CriteriaEditor({ criteria, onChange, onClose }) {
  const [local, setLocal] = useState(criteria.map(c => ({ ...c })));
  const totalWeight = local.filter(c => c.enabled).reduce((a, c) => a + c.weight, 0);

  const update = (id, field, value) => {
    setLocal(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "480px", maxHeight: "80vh", background: T.white, borderRadius: T.radiusLg, boxShadow: T.shadowLg, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.gray200}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: T.gray900 }}>Scoring Criteria</h3>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: T.gray500 }}>Customize which dimensions matter and their weight</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={T.gray400} /></button>
        </div>
        <div style={{ padding: "16px 24px", overflow: "auto", flex: 1 }}>
          {totalWeight !== 100 && (
            <div style={{ padding: "8px 12px", background: T.yellowLt, borderRadius: T.radiusSm, marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertTriangle size={14} color={T.yellow} />
              <span style={{ fontSize: "12px", color: T.gray700 }}>Weights should total 100%. Current: {totalWeight}%</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {local.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: c.enabled ? T.white : T.gray50, border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, opacity: c.enabled ? 1 : 0.6 }}>
                <input type="checkbox" checked={c.enabled} onChange={e => update(c.id, "enabled", e.target.checked)} style={{ accentColor: T.blue }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: T.gray800 }}>{c.label}</div>
                  <div style={{ fontSize: "11px", color: T.gray500 }}>{c.description}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <input type="range" min={0} max={50} value={c.weight} disabled={!c.enabled}
                    onChange={e => update(c.id, "weight", parseInt(e.target.value))}
                    style={{ width: "80px", accentColor: T.blue }} />
                  <span style={{ fontSize: "13px", fontWeight: 600, color: T.gray700, minWidth: "32px", textAlign: "right" }}>{c.weight}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${T.gray200}`, display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={() => { onChange(local); onClose(); }} disabled={totalWeight !== 100}>Save Criteria</Btn>
        </div>
      </div>
    </div>
  );
}
