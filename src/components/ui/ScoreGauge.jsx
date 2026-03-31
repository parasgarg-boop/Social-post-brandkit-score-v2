import { useState, useEffect } from 'react';
import T from '../../theme/tokens';

export default function ScoreGauge({ score, size = 130, strokeWidth = 11 }) {
  const [display, setDisplay] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (display / 100) * circ;
  const color = score >= 80 ? T.green : score >= 60 ? T.yellow : T.red;
  const label = score >= 80 ? "On Brand" : score >= 60 ? "Needs Work" : "Off Brand";
  const bg = score >= 80 ? T.greenLt : score >= 60 ? T.yellowLt : T.redLt;

  useEffect(() => {
    let start = Date.now();
    const dur = 1200;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * score));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={T.gray100} strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "36px", fontWeight: 700, color: T.gray900, lineHeight: 1 }}>{display}</span>
          <span style={{ fontSize: "12px", color: T.gray500, marginTop: "2px" }}>/100</span>
        </div>
      </div>
      <span style={{ fontSize: "12px", fontWeight: 600, color, background: bg, padding: "3px 12px", borderRadius: "20px" }}>{label}</span>
    </div>
  );
}
