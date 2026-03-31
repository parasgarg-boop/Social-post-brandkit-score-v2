import { ChevronDown } from 'lucide-react';
import T from '../../theme/tokens';

export default function Select({ value, options, onChange, placeholder, style: sx }) {
  return (
    <div style={{ position: "relative", ...sx }}>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", padding: "9px 32px 9px 14px", fontSize: "13px", color: value ? T.gray800 : T.gray400,
        border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, background: T.white,
        appearance: "none", cursor: "pointer", fontFamily: T.font,
      }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
      <ChevronDown size={16} color={T.gray400} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  );
}
