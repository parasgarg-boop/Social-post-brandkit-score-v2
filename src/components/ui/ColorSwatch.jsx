import T from '../../theme/tokens';

export default function ColorSwatch({ color, size = 28, onClick, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      {label && <span style={{ fontSize: "11px", color: T.gray500 }}>{label}</span>}
      <div onClick={onClick} style={{
        width: size, height: size, borderRadius: T.radiusSm, background: color,
        border: `2px solid ${T.gray200}`, cursor: onClick ? "pointer" : "default",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
      }} />
    </div>
  );
}
