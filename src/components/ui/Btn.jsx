import T from '../../theme/tokens';

export default function Btn({ children, variant = "primary", size = "md", onClick, style: sx, disabled, ...props }) {
  const base = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", border: "none", cursor: disabled ? "default" : "pointer", fontFamily: T.font, fontWeight: 600, borderRadius: T.radiusSm, transition: "all 0.15s", opacity: disabled ? 0.5 : 1 };
  const sizes = { sm: { padding: "5px 12px", fontSize: "12px" }, md: { padding: "8px 18px", fontSize: "13px" }, lg: { padding: "10px 24px", fontSize: "14px" } };
  const variants = {
    primary: { background: T.blue, color: T.white },
    secondary: { background: T.white, color: T.gray700, border: `1px solid ${T.gray200}` },
    ghost: { background: "transparent", color: T.blue },
    danger: { background: T.redLt, color: T.red },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...sx }} {...props}>{children}</button>;
}
