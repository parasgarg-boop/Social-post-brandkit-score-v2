import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import T from '../../theme/tokens';
import ScoreBar from '../ui/ScoreBar';
import SuggestionCard from '../ui/SuggestionCard';

export default function DimensionAccordion({ criterion, score, suggestions, verifyStates, onVerify, onApply, channelFilter, getAppliedChannels, getApplyingState }) {
  const [exp, setExp] = useState(score < 70);
  const color = score >= 80 ? T.green : score >= 60 ? T.yellow : T.red;
  const resolvedCount = suggestions.filter(s => verifyStates[s.id] === "resolved").length;
  const totalActionable = suggestions.filter(s => s.type !== "positive").length;
  return (
    <div style={{ borderRadius: T.radiusSm, border: `1px solid ${T.gray200}`, overflow: "hidden", background: T.white }}>
      <button onClick={() => setExp(!exp)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "11px 12px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: T.gray800 }}>{criterion.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {resolvedCount > 0 && <span style={{ fontSize: "10px", color: T.green, fontWeight: 500 }}>{resolvedCount}/{totalActionable}</span>}
              <span style={{ fontSize: "11px", color: T.gray400 }}>{criterion.weight}%</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color }}>{score}</span>
            </div>
          </div>
          <ScoreBar score={score} />
        </div>
        <ChevronDown size={14} color={T.gray400} style={{ transform: exp ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
      </button>
      {exp && suggestions.length > 0 && (
        <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: "6px", borderTop: `1px solid ${T.gray100}` }}>
          <div style={{ height: "8px" }} />
          {suggestions.map(s => (
            <SuggestionCard key={s.id} s={s} verifyState={verifyStates[s.id]} onVerify={onVerify}
              onApply={onApply} channelFilter={channelFilter}
              appliedChannels={getAppliedChannels ? getAppliedChannels(s) : []}
              applyingState={getApplyingState ? getApplyingState(s) : null} />
          ))}
        </div>
      )}
    </div>
  );
}
