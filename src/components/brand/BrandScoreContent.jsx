import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Shield, Palette, Settings, RefreshCw, Plus, Check, ChevronDown, Zap, CheckCircle2 } from 'lucide-react';
import T from '../../theme/tokens';
import ScoreGauge from '../ui/ScoreGauge';
import Pill from '../ui/Pill';
import Btn from '../ui/Btn';
import DimensionAccordion from './DimensionAccordion';
import CriteriaEditor from './CriteriaEditor';
import { ChannelIcon } from '../../data/channels';
import { generateScores } from '../../engine/scoringEngine';
import { DEFAULT_CRITERIA } from '../../data/scoring';

export default function BrandScoreContent({ brands, postContent, channels, selectedMedia, onOpenSettings, onApplyContent, onApplyMedia }) {
  const [selectedBrand, setSelectedBrand] = useState(brands[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyStates, setVerifyStates] = useState({}); // { [suggestionId]: "checking" | "resolved" | "unresolved" }
  const [channelFilter, setChannelFilter] = useState("all");
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA);
  const [showCriteriaEditor, setShowCriteriaEditor] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState({}); // { [suggestionKey]: [channelNames] }

  const runScoring = useCallback(() => {
    setLoading(true);
    setVerifyStates({});
    setTimeout(() => {
      setScoreData(generateScores(selectedBrand, postContent, channels, criteria, selectedMedia));
      setLoading(false);
    }, 2000);
  }, [selectedBrand, postContent, channels, criteria, selectedMedia]);

  useEffect(() => {
    if (!scoreData) runScoring();
  }, []);

  const allSuggestions = useMemo(() => {
    if (!scoreData) return [];
    const chList = channelFilter === "all" ? Object.keys(scoreData.channelSuggestions) : [channelFilter];

    if (channelFilter !== "all") {
      // Single channel: tag each suggestion with just that channel
      return (scoreData.channelSuggestions[channelFilter] || []).map(s => ({ ...s, _channels: [channelFilter] }));
    }

    // All channels: deduplicate by dimension + text similarity
    const groups = [];
    const groupMap = new Map(); // key -> group index
    chList.forEach(c => {
      (scoreData.channelSuggestions[c] || []).forEach(s => {
        const key = `${s.dimension}::${s.text}`;
        if (groupMap.has(key)) {
          const idx = groupMap.get(key);
          groups[idx]._channels.push(c);
          groups[idx]._ids.push(s.id);
        } else {
          groupMap.set(key, groups.length);
          groups.push({ ...s, _channels: [c], _ids: [s.id] });
        }
      });
    });
    return groups;
  }, [scoreData, channelFilter]);

  const handleVerify = (id) => {
    // Step 1: Show checking state
    setVerifyStates(prev => ({ ...prev, [id]: "checking" }));
    // Step 2: After a mock delay, re-evaluate the suggestion against current content
    setTimeout(() => {
      const suggestion = allSuggestions.find(s => s.id === id);
      if (!suggestion) { setVerifyStates(prev => ({ ...prev, [id]: "resolved" })); return; }
      // Mock re-evaluation: check if the user has addressed the suggestion
      const content = postContent || "";
      const contentLower = content.toLowerCase();
      let resolved = false;
      const dim = suggestion.dimension;
      if (dim === "voice") {
        // Check if a question was added or content is more engaging
        resolved = /\?/.test(content) || content.length > 100;
      } else if (dim === "media") {
        // Check if media was added
        resolved = selectedMedia && selectedMedia.length > 0;
      } else if (dim === "cta") {
        // Check for CTAs or links
        const ctas = ["shop","book","sign up","learn more","discover","visit","check","click","tap","try","follow","join","share","get started"];
        resolved = ctas.some(c => contentLower.includes(c)) || contentLower.includes("http") || contentLower.includes("www");
      } else if (dim === "hashtags") {
        resolved = (content.match(/#\w+/g) || []).length >= 3;
      } else if (dim === "structure") {
        const words = content.split(/\s+/).filter(Boolean);
        resolved = words.length >= 20 && words.length <= 250 && content.includes("\n");
      }
      setVerifyStates(prev => ({ ...prev, [id]: resolved ? "resolved" : "unresolved" }));
    }, 1200);
  };

  const handleApply = (suggestion, targetChannels) => {
    if (suggestion.dimension === "media") {
      // Media suggestion — open media gallery for those channels
      if (onApplyMedia) onApplyMedia(targetChannels);
    } else {
      // Text-based suggestion — generate improved content and apply
      const exampleText = suggestion.example || suggestion.action || "";
      if (onApplyContent) onApplyContent(exampleText, targetChannels, suggestion);
    }
    // Track which channels this suggestion was applied to
    const key = `${suggestion.dimension}::${suggestion.text}`;
    setAppliedSuggestions(prev => {
      const existing = prev[key] || [];
      const merged = [...new Set([...existing, ...targetChannels])];
      return { ...prev, [key]: merged };
    });
  };

  const getAppliedChannels = (suggestion) => {
    const key = `${suggestion.dimension}::${suggestion.text}`;
    return appliedSuggestions[key] || [];
  };

  const actionable = allSuggestions.filter(s => s.type !== "positive");
  const resolvedCount = actionable.filter(s => verifyStates[s.id] === "resolved").length;
  const estimatedGain = actionable.filter(s => verifyStates[s.id] === "resolved").reduce((a, s) => a + (s.impact || 0), 0);

  return (
    <>
      {showCriteriaEditor && <CriteriaEditor criteria={criteria} onChange={c => { setCriteria(c); setScoreData(null); setTimeout(runScoring, 100); }} onClose={() => setShowCriteriaEditor(false)} />}

      {/* Action bar */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "10px 18px 10px", borderBottom: `1px solid ${T.gray100}`, flexShrink: 0 }}>
        <button onClick={() => setShowCriteriaEditor(true)} title="Scoring criteria" style={{ background: "none", border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, padding: "4px", cursor: "pointer", display: "flex" }}
          onMouseOver={e => e.currentTarget.style.background = T.gray50} onMouseOut={e => e.currentTarget.style.background = "none"}>
          <Settings size={14} color={T.gray500} />
        </button>
        <button onClick={() => { setScoreData(null); setTimeout(runScoring, 50); }} title="Re-analyze" style={{ background: "none", border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, padding: "4px", cursor: "pointer", display: "flex" }}
          onMouseOver={e => e.currentTarget.style.background = T.gray50} onMouseOut={e => e.currentTarget.style.background = "none"}>
          <RefreshCw size={14} color={T.gray500} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Brand selector */}
          <div>
            <label style={{ fontSize: "12px", fontWeight: 500, color: T.gray500, display: "block", marginBottom: "5px" }}>Brand Identity</label>
            <div style={{ position: "relative" }}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px",
                background: T.white, border: `1px solid ${dropdownOpen ? T.blue : T.gray200}`, borderRadius: T.radiusSm, cursor: "pointer", textAlign: "left",
              }}>
                <span style={{ fontSize: "18px" }}>{selectedBrand.logo}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: T.gray800 }}>{selectedBrand.name}</div>
                  <div style={{ fontSize: "11px", color: T.gray500 }}>{selectedBrand.domain || selectedBrand.locations}</div>
                </div>
                <ChevronDown size={16} color={T.gray400} style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
              </button>
              {dropdownOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 10, background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, boxShadow: T.shadowLg, overflow: "hidden" }}>
                  {brands.map(b => (
                    <button key={b.id} onClick={() => { setSelectedBrand(b); setDropdownOpen(false); setScoreData(null); setTimeout(runScoring, 100); }} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
                      background: b.id === selectedBrand.id ? T.blueLt : "none", border: "none", cursor: "pointer", borderBottom: `1px solid ${T.gray100}`, textAlign: "left",
                    }}>
                      <span style={{ fontSize: "16px" }}>{b.logo}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: T.gray800 }}>{b.name}</div>
                        <div style={{ fontSize: "11px", color: T.gray500 }}>{b.domain || b.locations}</div>
                      </div>
                      {b.id === selectedBrand.id && <Check size={16} color={T.blue} />}
                    </button>
                  ))}
                  <button onClick={() => { setDropdownOpen(false); onOpenSettings(); }} style={{
                    width: "100%", padding: "10px 12px", background: T.gray50, border: "none", cursor: "pointer",
                    fontSize: "12px", color: T.blue, fontWeight: 500, display: "flex", alignItems: "center", gap: "6px",
                  }}><Plus size={14} /> Manage Brand Identities</button>
                </div>
              )}
            </div>
          </div>

          {/* Brand summary */}
          <div style={{ padding: "10px 12px", background: T.gray50, borderRadius: T.radiusSm }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
              <Shield size={12} color={T.blue} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: T.gray700 }}>Brand Guidelines</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginBottom: "6px" }}>
              {selectedBrand.voice.personality.map(p => <Pill key={p} color={T.blue} bg={T.blueLt}>{p}</Pill>)}
              {selectedBrand.voice.tone.map(t => <Pill key={t} color={T.purple} bg={T.purpleLt}>{t}</Pill>)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Palette size={11} color={T.gray500} />
              <div style={{ display: "flex", gap: "3px" }}>
                {[selectedBrand.kit.colors.primary, selectedBrand.kit.colors.secondary, selectedBrand.kit.colors.dark].filter(Boolean).map((c, i) => (
                  <div key={i} style={{ width: 14, height: 14, borderRadius: "3px", background: c, border: "1px solid rgba(0,0,0,0.1)" }} />
                ))}
              </div>
              <span style={{ fontSize: "11px", color: T.gray500 }}>{selectedBrand.kit.fonts.header}, {selectedBrand.kit.fonts.body}</span>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: "16px" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${T.gray200}`, borderTopColor: T.blue, animation: "spin 1s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "14px", fontWeight: 500, color: T.gray800, margin: "0 0 4px" }}>Analyzing your post...</p>
                <p style={{ fontSize: "12px", color: T.gray500, margin: 0 }}>Checking content, media, CTAs & hashtags against "{selectedBrand.name}" guidelines</p>
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && scoreData && (
            <>
              {/* Gauge */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 0" }}>
                <ScoreGauge score={scoreData.overall} />
                <p style={{ fontSize: "12px", color: T.gray500, marginTop: "6px", textAlign: "center", lineHeight: "17px" }}>
                  Your post is <strong style={{ color: T.gray700 }}>{scoreData.overall >= 80 ? "well aligned" : scoreData.overall >= 60 ? "partially aligned" : "not aligned"}</strong> with {selectedBrand.name}
                  {resolvedCount > 0 && <><br /><span style={{ color: T.green }}>Verified: {resolvedCount}/{actionable.length} resolved (+{estimatedGain} pts)</span></>}
                </p>
              </div>

              {/* Channel filter */}
              {channels.length > 1 && (
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  <Pill onClick={() => setChannelFilter("all")} selected={channelFilter === "all"} color={T.blue} bg={T.blueLt}>All Channels</Pill>
                  {channels.map(ch => (
                    <Pill key={ch} onClick={() => setChannelFilter(ch)} selected={channelFilter === ch} color={T.blue} bg={T.blueLt}>
                      <ChannelIcon type={ch} size={12} /> <span style={{ textTransform: "capitalize" }}>{ch}</span>
                    </Pill>
                  ))}
                </div>
              )}

              {/* Score breakdown with inline suggestions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {criteria.filter(c => c.enabled).map(c => (
                  <DimensionAccordion key={c.id} criterion={c} score={scoreData.scores[c.id] || 70}
                    suggestions={allSuggestions.filter(s => s.dimension === c.id)}
                    verifyStates={verifyStates} onVerify={handleVerify}
                    onApply={handleApply} channelFilter={channelFilter}
                    getAppliedChannels={getAppliedChannels} />
                ))}
              </div>

              {/* Verify all */}
              {resolvedCount < actionable.length && (
                <Btn variant="primary" style={{ width: "100%" }} onClick={() => actionable.forEach(s => { if (verifyStates[s.id] !== "resolved") handleVerify(s.id); })}>
                  <Zap size={14} /> Verify All Suggestions
                </Btn>
              )}
            </>
          )}
        </div>
    </>
  );
}
