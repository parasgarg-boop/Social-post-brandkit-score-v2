import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import T from '../../theme/tokens';
import Pill from './Pill';

export default function TagInput({ selected, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const available = options.filter(o => !selected.includes(o));
  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setOpen(!open)} style={{
        display: "flex", flexWrap: "wrap", gap: "4px", padding: "6px 10px",
        border: `1px solid ${open ? T.blue : T.gray200}`, borderRadius: T.radiusSm,
        background: T.white, cursor: "pointer", minHeight: "38px", alignItems: "center",
      }}>
        {selected.map(s => (
          <Pill key={s} color={T.blue} bg={T.blueLt} onRemove={() => onChange(selected.filter(x => x !== s))}>{s}</Pill>
        ))}
        {selected.length === 0 && <span style={{ fontSize: "13px", color: T.gray400 }}>{placeholder}</span>}
        <ChevronDown size={14} color={T.gray400} style={{ marginLeft: "auto" }} />
      </div>
      {open && available.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, boxShadow: T.shadowLg, maxHeight: "200px", overflow: "auto" }}>
          {available.map(o => (
            <div key={o} onClick={() => { onChange([...selected, o]); }} style={{ padding: "8px 14px", fontSize: "13px", color: T.gray700, cursor: "pointer" }}
              onMouseOver={e => e.currentTarget.style.background = T.gray50}
              onMouseOut={e => e.currentTarget.style.background = T.white}
            >{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}
