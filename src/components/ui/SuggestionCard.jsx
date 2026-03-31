import { useState } from 'react';
import { CheckCircle2, RefreshCw, Check, Lightbulb, ArrowRight, Info } from 'lucide-react';
import T from '../../theme/tokens';
import Btn from './Btn';
import { ChannelIcon } from '../../data/channels';

export default function SuggestionCard({ s, verifyState, onVerify, onApply, channelFilter, appliedChannels }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const isPositive = s.type === "positive";
  const prioStyle = { high: { bg: T.redLt, color: T.red, label: "High Impact" }, medium: { bg: T.yellowLt, color: T.yellow, label: "Medium" }, low: { bg: T.gray100, color: T.gray500, label: "Low" }, none: { bg: T.greenLt, color: T.green, label: "" } };
  const ps = prioStyle[s.priority] || prioStyle.low;
  const isResolved = verifyState === "resolved";
  const isChecking = verifyState === "checking";
  const wasChecked = verifyState === "unresolved";

  // Determine if this suggestion can be directly applied
  const canApply = s.dimension === "voice" || s.dimension === "cta" || s.dimension === "structure" || s.dimension === "hashtags";
  const isMediaSuggestion = s.dimension === "media";
  // Show which channels this suggestion applies to
  const channels = s._channels || [];
  // Which channels already had this applied
  const applied = appliedChannels || [];
  const allApplied = channels.length > 0 && channels.every(ch => applied.includes(ch));

  return (
    <div style={{
      borderRadius: T.radiusSm, background: allApplied ? T.greenLt : isPositive ? T.greenLt : T.white,
      border: `1px solid ${allApplied ? "#BBF7D0" : isPositive ? "#BBF7D0" : wasChecked ? T.yellowLt : T.gray200}`,
      overflow: "hidden", transition: "all 0.2s", opacity: allApplied ? 0.75 : 1,
    }}>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ flex: 1 }}>
            {/* Channel icons row */}
            {channels.length > 0 && (
              <div style={{ display: "flex", gap: "3px", marginBottom: "5px" }}>
                {channels.map(ch => (
                  <ChannelIcon key={ch} type={ch} size={14} />
                ))}
              </div>
            )}
            <p style={{ fontSize: "13px", color: T.gray700, lineHeight: "19px", margin: 0 }}>
              {isPositive && <CheckCircle2 size={13} color={T.green} style={{ marginRight: 4, verticalAlign: "middle" }} />}
              {allApplied && <CheckCircle2 size={13} color={T.green} style={{ marginRight: 4, verticalAlign: "middle" }} />}
              {s.text}
            </p>
            <div style={{ display: "flex", gap: "6px", marginTop: "6px", alignItems: "center", flexWrap: "wrap" }}>
              {s.priority !== "none" && !allApplied && (
                <span style={{ fontSize: "11px", fontWeight: 500, color: ps.color, background: ps.bg, padding: "1px 7px", borderRadius: "4px" }}>{ps.label}</span>
              )}
              {s.impact > 0 && !allApplied && <span style={{ fontSize: "11px", color: T.green, fontWeight: 600 }}>+{s.impact} pts</span>}
              {wasChecked && <span style={{ fontSize: "11px", fontWeight: 500, color: T.yellow, background: T.yellowLt, padding: "1px 7px", borderRadius: "4px" }}>Still needs attention</span>}
              {(s.reasoning || s.example) && !allApplied && (
                <button onClick={() => setShowDetail(!showDetail)} style={{ fontSize: "11px", color: T.blue, background: "none", border: "none", cursor: "pointer", fontWeight: 500, padding: 0 }}>
                  {showDetail ? "Hide reasoning" : "Why this matters?"}
                </button>
              )}
            </div>
          </div>
          {/* Action buttons */}
          {!isPositive && !allApplied && !isChecking && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignSelf: "flex-start", flexShrink: 0 }}>
              {canApply && onApply && (
                <Btn variant="primary" size="sm" onClick={() => {
                  const targetChannels = channelFilter && channelFilter !== "all" ? [channelFilter] : channels;
                  onApply(s, targetChannels);
                }} style={{ fontWeight: 500 }}>
                  Apply
                </Btn>
              )}
              {isMediaSuggestion && onApply && (
                <Btn variant="primary" size="sm" onClick={() => {
                  onApply(s, channelFilter && channelFilter !== "all" ? [channelFilter] : channels);
                }} style={{ fontWeight: 500 }}>
                  Add Media
                </Btn>
              )}
              {!canApply && !isMediaSuggestion && (
                <div style={{ position: "relative" }}>
                  <Btn variant="secondary" size="sm"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    style={{ color: T.gray500, fontWeight: 500, cursor: "default" }}>
                    <Info size={12} /> Manual
                  </Btn>
                  {showTooltip && (
                    <div style={{
                      position: "absolute", bottom: "calc(100% + 6px)", right: 0, width: "200px",
                      padding: "8px 10px", background: T.gray800, color: T.white, borderRadius: T.radiusSm,
                      fontSize: "11px", lineHeight: "15px", zIndex: 20, boxShadow: T.shadowLg,
                    }}>
                      This suggestion requires manual changes outside the editor (e.g., brand colors, image editing, account settings).
                      <div style={{ position: "absolute", bottom: "-4px", right: "16px", width: 8, height: 8, background: T.gray800, transform: "rotate(45deg)" }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {isChecking && (
            <div style={{ alignSelf: "center", flexShrink: 0, padding: "4px 8px" }}>
              <RefreshCw size={14} color={T.blue} style={{ animation: "spin 1s linear infinite" }} />
            </div>
          )}
          {allApplied && (
            <div style={{ alignSelf: "center", display: "flex", alignItems: "center", gap: "3px", color: T.green, fontSize: "12px", fontWeight: 500, flexShrink: 0 }}>
              <Check size={14} /> Applied
            </div>
          )}
        </div>
      </div>

      {/* Expandable reasoning section */}
      {showDetail && (
        <div style={{ padding: "0 12px 12px", borderTop: `1px solid ${T.gray100}`, marginTop: "0" }}>
          {s.reasoning && (
            <div style={{ marginTop: "8px", padding: "8px 10px", background: T.gray50, borderRadius: "4px", borderLeft: `3px solid ${T.blue}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                <Lightbulb size={12} color={T.blue} />
                <span style={{ fontSize: "11px", fontWeight: 600, color: T.blue }}>Why this matters</span>
              </div>
              <p style={{ fontSize: "12px", color: T.gray600, lineHeight: "17px", margin: 0 }}>{s.reasoning}</p>
            </div>
          )}
          {s.action && (
            <div style={{ marginTop: "6px", display: "flex", alignItems: "flex-start", gap: "4px" }}>
              <ArrowRight size={12} color={T.green} style={{ marginTop: "2px", flexShrink: 0 }} />
              <span style={{ fontSize: "12px", color: T.gray700, fontWeight: 500 }}>{s.action}</span>
            </div>
          )}
          {s.example && (
            <div style={{ marginTop: "6px", padding: "6px 10px", background: T.purpleLt, borderRadius: "4px" }}>
              <span style={{ fontSize: "11px", color: T.purple, fontWeight: 500 }}>💡 Example: </span>
              <span style={{ fontSize: "12px", color: T.gray600, fontStyle: "italic" }}>{s.example}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
