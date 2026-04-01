import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, ChevronDown, ChevronUp, Camera, Smile, Copy, Sparkles, Send, Clock, Eye, Shield, HelpCircle, AlertTriangle, CheckCircle2, XCircle, Search, Globe, Plus, Monitor } from 'lucide-react';
import T from '../../theme/tokens';
import Btn from '../ui/Btn';
import Select from '../ui/Select';
import Pill from '../ui/Pill';
import { ChannelIcon, CHANNEL_LIMITS, CHANNEL_PROFILES } from '../../data/channels';
import { BUSINESS_TOKENS, MOCK_LOCATIONS, resolveTokens } from '../../data/tokens';
import EmojiPicker from '../modals/EmojiPicker';
import MediaGalleryModal from '../modals/MediaGalleryModal';
import SchedulePickerModal from '../modals/SchedulePickerModal';
import BrandScoreContent from '../brand/BrandScoreContent';
import AIDrawerContent from '../ai/AIDrawerContent';
import FacebookPreview from './FacebookPreview';
import InstagramPreview from './InstagramPreview';
import LinkedInPreview from './LinkedInPreview';
import TwitterPreview from './TwitterPreview';
import GenericChannelPreview from './GenericChannelPreview';

const CHANNEL_PREVIEW_MAP = {
  facebook: FacebookPreview,
  instagram: InstagramPreview,
  linkedin: LinkedInPreview,
  twitter: TwitterPreview,
};

export default function CreatePostPage({ brands, onNavigate }) {
  const [postContent, setPostContent] = useState(
    "Nothing beats a freshly grilled burger stacked with juicy patties, soft buns, and bold flavors in every bite. At our shop, we keep it simple\u2014real ingredients, perfect grills, and burgers made to satisfy serious cravings. From the first bite to the last crumb, it's comfort, indulgence, and happiness all wrapped in one burger. Come hungry, eat happy, and leave planning your next visit. \u{1F354}\u{1F525}"
  );
  const [channels, setChannels] = useState(["facebook", "instagram", "linkedin"]);
  const [activeEditorTab, setActiveEditorTab] = useState("Initial content");

  // Per-channel content overrides: { facebook: "...", instagram: "..." }
  const [channelOverrides, setChannelOverrides] = useState({});

  /* New feature state */
  const [rightTab, setRightTab] = useState("preview");
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  const [scheduleTz, setScheduleTz] = useState(null);
  const [showTokenPicker, setShowTokenPicker] = useState(false);
  const [tokenSearch, setTokenSearch] = useState("");
  const [previewLocation, setPreviewLocation] = useState(null); // null = generic (unresolved tokens)
  const [expandedChannels, setExpandedChannels] = useState({});
  const emojiAnchorRef = useRef(null);
  const textareaRef = useRef(null);

  const removeChannel = (ch) => setChannels(prev => prev.filter(c => c !== ch));

  const handleMediaSelect = (img) => {
    setSelectedMedia(prev => prev.find(m => m.id === img.id) ? prev.filter(m => m.id !== img.id) : [...prev, img]);
  };

  const handleMediaUpload = (uploadedFile) => {
    setSelectedMedia(prev => [...prev, uploadedFile]);
  };

  const insertEmoji = (emoji) => {
    const ta = textareaRef.current;
    if (ta) {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const current = editorContent;
      const newText = current.substring(0, start) + emoji + current.substring(end);
      handleEditorChange(newText);
      setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = start + emoji.length; }, 0);
    } else {
      handleEditorChange(editorContent + emoji);
    }
  };

  const handleSchedule = (d, t, tz) => { setScheduleDate(d); setScheduleTime(t); setScheduleTz(tz); };

  const insertToken = (tokenKey) => {
    const tokenStr = `{{${tokenKey}}}`;
    const ta = textareaRef.current;
    if (ta) {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const current = editorContent;
      const newText = current.substring(0, start) + tokenStr + current.substring(end);
      handleEditorChange(newText);
      setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = start + tokenStr.length; }, 0);
    } else {
      handleEditorChange(editorContent + tokenStr);
    }
  };

  const toggleChannelExpand = (ch) => setExpandedChannels(prev => ({ ...prev, [ch]: !prev[ch] }));

  // Initialize first channel as expanded
  useEffect(() => {
    if (channels.length > 0 && Object.keys(expandedChannels).length === 0) {
      setExpandedChannels({ [channels[channels.length - 1]]: true });
    }
  }, [channels]);

  // Get the effective content for a given channel (override or base)
  const getChannelContent = (ch) => channelOverrides[ch] || postContent;

  // Get the content for the currently active editor tab
  const activeChannelKey = channels.find(ch => (CHANNEL_LIMITS[ch]?.label || ch) === activeEditorTab);
  const editorContent = activeChannelKey ? getChannelContent(activeChannelKey) : postContent;

  const handleEditorChange = (newText) => {
    if (activeChannelKey) {
      // Editing a specific channel tab — store as override
      setChannelOverrides(prev => ({ ...prev, [activeChannelKey]: newText }));
    } else {
      // Editing "Initial content" — update base content
      setPostContent(newText);
    }
  };

  // Called when a text suggestion is applied from Brand Score (receives LLM-improved content)
  const handleApplyContent = (improvedContent, targetChannels, suggestion) => {
    targetChannels.forEach(ch => {
      setChannelOverrides(prev => ({ ...prev, [ch]: improvedContent }));
    });
  };

  // Called when a media suggestion is applied
  const handleApplyMedia = (targetChannels) => {
    setShowMediaGallery(true);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Modals */}
      {showMediaGallery && <MediaGalleryModal selectedMedia={selectedMedia} onSelect={handleMediaSelect} onUpload={handleMediaUpload} onClose={() => setShowMediaGallery(false)} />}
      {showSchedulePicker && <SchedulePickerModal initialDate={scheduleDate} initialTime={scheduleTime} onSchedule={handleSchedule} onClose={() => setShowSchedulePicker(false)} />}

      {/* Header */}
      <div style={{ height: "56px", background: T.white, borderBottom: `1px solid ${T.gray200}`, display: "flex", alignItems: "center", padding: "0 24px", gap: "12px", flexShrink: 0 }}>
        <button onClick={() => onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: T.gray600 }}>
          <ArrowLeft size={18} />
        </button>
        <span style={{ fontSize: "15px", fontWeight: 600, color: T.gray900 }}>Create post</span>
        <div style={{ flex: 1 }} />



        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: T.gray600 }}>
          <div style={{ width: 18, height: 18, borderRadius: "4px", background: T.white, border: `2px solid ${T.gray300}`, display: "flex", alignItems: "center", justifyContent: "center" }} />
          Add post to library
          <HelpCircle size={14} color={T.gray400} />
        </label>

        <div style={{ display: "flex" }}>
          <Btn variant="primary" style={{ borderRadius: "6px 0 0 6px" }} onClick={() => setShowSchedulePicker(true)}>
            {scheduleDate ? (<><Clock size={13} /> {new Date(scheduleDate + "T" + (scheduleTime || "10:00")).toLocaleDateString("en-US", { month: "short", day: "numeric" })} {scheduleTime || "10:00"}</>) : (<><Send size={13} /> Schedule post</>)}
          </Btn>
          <button onClick={() => setShowSchedulePicker(true)} style={{ padding: "8px 8px", background: T.blueHover, color: T.white, border: "none", borderLeft: `1px solid rgba(255,255,255,0.2)`, borderRadius: "0 6px 6px 0", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left: composer */}
        <div style={{ flex: 1, minWidth: 0, overflow: "auto", padding: "20px 24px" }}>

          {/* Channel pills */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {channels.map(ch => (
              <span key={ch} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", background: T.gray50, borderRadius: "18px", fontSize: "13px", color: T.gray700, border: `1px solid ${T.gray200}` }}>
                <ChannelIcon type={ch} />
                <span style={{ textTransform: "capitalize" }}>{CHANNEL_PROFILES[ch]?.countLabel || ch}</span>
                <X size={13} color={T.gray400} style={{ cursor: "pointer" }} onClick={() => removeChannel(ch)} />
              </span>
            ))}
            <button style={{ display: "flex", alignItems: "center", color: T.gray400, background: "none", border: "none", cursor: "pointer" }}>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Editor tabs */}
          <div style={{ background: T.white, borderRadius: T.radius, border: `1px solid ${T.gray200}`, marginBottom: "8px" }}>
            <div style={{ display: "flex", borderBottom: `2px solid ${T.gray200}` }}>
              {["Initial content", ...channels.map(ch => CHANNEL_LIMITS[ch]?.label || ch)].map(tab => {
                const tabChannel = channels.find(ch => (CHANNEL_LIMITS[ch]?.label || ch) === tab);
                const hasOverride = tabChannel && channelOverrides[tabChannel];
                return (
                <button key={tab} onClick={() => setActiveEditorTab(tab)} style={{
                  padding: "10px 16px", fontSize: "13px", fontWeight: activeEditorTab === tab ? 600 : 400,
                  color: activeEditorTab === tab ? T.blue : T.gray500, background: "none", border: "none",
                  borderBottom: activeEditorTab === tab ? `2px solid ${T.blue}` : "2px solid transparent",
                  cursor: "pointer", marginBottom: "-2px", position: "relative",
                }}>
                  {tab}
                  {hasOverride && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: T.green, marginLeft: 4, verticalAlign: "middle" }} />}
                </button>);
              })}
            </div>
            <div style={{ padding: "0" }}>
              <textarea ref={textareaRef} value={editorContent} onChange={e => handleEditorChange(e.target.value)} style={{
                width: "100%", minHeight: "140px", padding: "16px", border: "none", outline: "none",
                fontSize: "14px", color: T.gray800, lineHeight: "22px", resize: "vertical",
                fontFamily: T.font, boxSizing: "border-box",
              }} placeholder="What would you like to share?" />

              {/* Selected media thumbnails */}
              {selectedMedia.length > 0 && (
                <div style={{ padding: "0 16px 10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {selectedMedia.map(img => (
                    <div key={img.id} style={{
                      position: "relative", width: "60px", height: "60px", borderRadius: "6px", overflow: "hidden",
                      background: img.isUpload ? T.gray200 : img.gradient,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {img.isUpload ? (
                        img.fileType === "video" ? <Monitor size={20} color={T.gray500} /> : <img src={img.dataUrl} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: "20px" }}>{img.emoji}</span>
                      )}
                      <button onClick={() => setSelectedMedia(prev => prev.filter(m => m.id !== img.id))} style={{
                        position: "absolute", top: "-6px", right: "-6px", width: "18px", height: "18px", borderRadius: "50%",
                        background: T.gray800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                      }}><X size={10} color="white" /></button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderTop: `1px solid ${T.gray100}`, position: "relative" }}>
                <div style={{ display: "flex", gap: "10px", position: "relative" }}>
                  <button onClick={() => setShowMediaGallery(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }} title="Add media"><Camera size={18} color={T.gray500} /></button>
                  <div style={{ position: "relative" }}>
                    <button ref={emojiAnchorRef} onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }} title="Insert emoji"><Smile size={18} color={showEmojiPicker ? T.blue : T.gray500} /></button>
                    {showEmojiPicker && <EmojiPicker anchorRef={emojiAnchorRef} onSelect={(em) => { insertEmoji(em); }} onClose={() => setShowEmojiPicker(false)} />}
                  </div>
                  <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><Copy size={18} color={T.gray500} /></button>
                  <button onClick={() => setRightTab("ai")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "2px 4px", borderRadius: "4px", background: `linear-gradient(135deg, ${T.blue}, ${T.purple})` }} title="AI Generate">
                    <Sparkles size={14} color={T.white} />
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <button onClick={() => setShowTokenPicker(!showTokenPicker)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: T.blue, fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
                    Personalize <ChevronDown size={12} style={{ transform: showTokenPicker ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
                  </button>
                  {showTokenPicker && (
                    <div style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 0, width: "260px", background: T.white, border: `1px solid ${T.gray200}`, borderRadius: T.radius, boxShadow: T.shadowLg, zIndex: 50, overflow: "hidden" }}>
                      <div style={{ padding: "10px 12px", borderBottom: `1px solid ${T.gray100}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px", background: T.gray50, borderRadius: T.radiusSm, border: `1px solid ${T.gray200}` }}>
                          <Search size={14} color={T.gray400} />
                          <input value={tokenSearch} onChange={e => setTokenSearch(e.target.value)} placeholder="Search tokens" style={{ flex: 1, border: "none", background: "none", outline: "none", fontSize: "13px", fontFamily: T.font, color: T.gray700 }} />
                        </div>
                      </div>
                      <div style={{ maxHeight: "240px", overflow: "auto", padding: "6px 0" }}>
                        {BUSINESS_TOKENS.map(cat => {
                          const filtered = cat.tokens.filter(t => !tokenSearch || t.label.toLowerCase().includes(tokenSearch.toLowerCase()));
                          if (filtered.length === 0) return null;
                          return (
                            <div key={cat.category}>
                              <div style={{ fontSize: "11px", fontWeight: 600, color: T.gray500, padding: "8px 14px 4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{cat.category}</div>
                              {filtered.map(tok => (
                                <button key={tok.key} onClick={() => { insertToken(tok.key); setShowTokenPicker(false); setTokenSearch(""); }} style={{
                                  width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: "8px 14px", display: "block",
                                }} onMouseOver={e => e.currentTarget.style.background = T.gray50} onMouseOut={e => e.currentTarget.style.background = "none"}>
                                  <div style={{ fontSize: "13px", color: T.gray800, fontWeight: 500 }}>{tok.label}</div>
                                  <div style={{ fontSize: "11px", color: T.gray400, marginTop: "1px" }}>E.g. {tok.example}</div>
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Per-channel character counters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {channels.map(ch => {
              const info = CHANNEL_LIMITS[ch];
              if (!info) return null;
              const chContent = getChannelContent(ch);
              const pct = chContent.length / info.limit;
              const remaining = info.limit - chContent.length;
              const isWarn = pct >= info.warn;
              const isOver = remaining < 0;
              return (
                <div key={ch} style={{
                  display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px",
                  background: isOver ? "#FEE2E2" : isWarn ? "#FFF7ED" : T.gray50,
                  borderRadius: "14px", border: `1px solid ${isOver ? "#FECACA" : isWarn ? "#FED7AA" : T.gray200}`,
                }}>
                  <ChannelIcon type={ch} size={12} />
                  <span style={{ fontSize: "11px", fontWeight: 500, color: isOver ? "#DC2626" : isWarn ? "#EA580C" : T.gray600 }}>
                    {remaining.toLocaleString()} / {info.limit.toLocaleString()}
                  </span>
                  {isOver && <XCircle size={11} color="#DC2626" />}
                  {isWarn && !isOver && <AlertTriangle size={11} color="#EA580C" />}
                  {!isWarn && <CheckCircle2 size={11} color={T.green} />}
                </div>
              );
            })}
          </div>

          {/* Tags */}
          <div style={{ background: T.white, borderRadius: T.radius, border: `1px solid ${T.gray200}`, padding: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px", fontWeight: 500, color: T.gray800 }}>Tags</span>
                <HelpCircle size={14} color={T.gray400} />
              </div>
              <span style={{ fontSize: "13px", color: T.blue, cursor: "pointer", fontWeight: 500 }}>Manage tags</span>
            </div>
            <input placeholder="Search or create a tag" style={{ width: "100%", padding: "9px 14px", border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, fontSize: "13px", fontFamily: T.font, outline: "none", boxSizing: "border-box" }} />
          </div>

          {/* Approvals */}
          <div style={{ background: T.white, borderRadius: T.radius, border: `1px solid ${T.gray200}`, padding: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: T.gray800 }}>Approvals</span>
              <HelpCircle size={14} color={T.gray400} />
            </div>
            <Select value="" placeholder="Select workflow" options={["Manager approval", "Team lead review", "Auto-approve"]} onChange={() => {}} />
          </div>

          {/* Posting checklist */}
          <div style={{ background: T.white, borderRadius: T.radius, border: `1px solid ${T.gray200}`, padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: T.gray800 }}>Posting checklist</span>
              <ChevronUp size={16} color={T.gray400} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <AlertTriangle size={14} color={T.yellow} style={{ marginTop: "2px", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: T.gray600, lineHeight: "18px" }}>Instagram's daily limit for sharing posts, reels, and stories combined is 50.</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <AlertTriangle size={14} color={T.yellow} style={{ marginTop: "2px", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: T.gray600, lineHeight: "18px" }}>
                  The <span style={{ color: T.blue, cursor: "pointer" }}>Google</span>, <span style={{ color: T.blue, cursor: "pointer" }}>LinkedIn</span> or <span style={{ color: T.blue, cursor: "pointer" }}>Tiktok</span> accounts of at least one of your locations is disconnected or missing required permissions.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel: Tabbed Preview + Brand Score */}
        <div style={{ width: "380px", borderLeft: `1px solid ${T.gray200}`, background: T.white, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>

          {/* Tab switcher */}
          <div style={{ display: "flex", padding: "10px 18px 0", gap: "0", borderBottom: `2px solid ${T.gray200}`, flexShrink: 0 }}>
            {[{ key: "preview", icon: Eye, label: "Preview" }, { key: "score", icon: Shield, label: "Brand Score" }, { key: "ai", icon: Sparkles, label: "BirdAI" }].map(tab => (
              <button key={tab.key} onClick={() => setRightTab(tab.key)} style={{
                display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", fontSize: "13px", fontWeight: rightTab === tab.key ? 600 : 400,
                color: rightTab === tab.key ? T.blue : T.gray500, background: "none", border: "none",
                borderBottom: rightTab === tab.key ? `2px solid ${T.blue}` : "2px solid transparent",
                cursor: "pointer", marginBottom: "-2px",
              }}>
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Preview tab content */}
          {rightTab === "preview" && (
            <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
              {/* Info bar + Location dropdown */}
              <div style={{ padding: "14px 18px 10px", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "4px", marginBottom: "12px" }}>
                  <HelpCircle size={13} color={T.gray400} style={{ marginTop: "1px", flexShrink: 0 }} />
                  <p style={{ fontSize: "11px", color: T.gray500, margin: 0, lineHeight: "15px" }}>
                    This is how your post would appear on social channels where it's posted. Published posts may slightly differ from the preview.
                  </p>
                </div>
                {/* Location dropdown for token resolution */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Globe size={14} color={T.gray500} />
                  <select value={previewLocation || ""} onChange={e => setPreviewLocation(e.target.value || null)} style={{
                    flex: 1, padding: "6px 10px", fontSize: "12px", border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm,
                    fontFamily: T.font, color: T.gray700, background: T.white, cursor: "pointer", outline: "none",
                  }}>
                    <option value="">All locations (generic preview)</option>
                    {MOCK_LOCATIONS.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Channel previews */}
              <div style={{ flex: 1, overflow: "auto", padding: "0 18px 18px" }}>
                {channels.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {channels.map(ch => {
                      const isExpanded = expandedChannels[ch] !== false;
                      const chInfo = CHANNEL_PROFILES[ch] || { countLabel: "1 page", getProfile: () => ({ name: "Your Page", avatar: null }) };
                      const loc = previewLocation ? MOCK_LOCATIONS.find(l => l.id === previewLocation) : null;
                      const profile = chInfo.getProfile(loc);
                      const resolvedContent = resolveTokens(getChannelContent(ch), loc);
                      const PreviewComp = CHANNEL_PREVIEW_MAP[ch] || GenericChannelPreview;
                      return (
                        <div key={ch}>
                          {/* Channel accordion header */}
                          <button onClick={() => toggleChannelExpand(ch)} style={{
                            width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "10px 0",
                            background: "none", border: "none", cursor: "pointer", textAlign: "left",
                          }}>
                            <ChannelIcon type={ch} />
                            <span style={{ fontSize: "13px", fontWeight: 500, color: T.gray800, textTransform: "capitalize" }}>
                              {CHANNEL_LIMITS[ch]?.label || ch}
                            </span>
                            <span style={{ fontSize: "13px", color: T.blue }}>{chInfo.countLabel}</span>
                            <div style={{ flex: 1 }} />
                            {isExpanded ? <ChevronUp size={16} color={T.gray400} /> : <ChevronDown size={16} color={T.gray400} />}
                          </button>
                          {/* Channel preview body */}
                          {isExpanded && (
                            <div style={{ marginBottom: "8px" }}>
                              <PreviewComp
                                content={resolvedContent}
                                profile={profile}
                                brand={brands[0]}
                                selectedMedia={selectedMedia}
                                channel={ch}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", color: T.gray400 }}>
                    <div style={{ width: 80, height: 60, background: T.gray100, borderRadius: T.radius, marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Monitor size={24} color={T.gray300} />
                    </div>
                    <p style={{ fontSize: "13px", textAlign: "center" }}>Select a channel and start creating a post to see a preview.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Brand Score tab content */}
          {rightTab === "score" && (
            <BrandScoreContent
              brands={brands}
              postContent={postContent}
              channels={channels}
              selectedMedia={selectedMedia}
              onOpenSettings={() => { setRightTab("preview"); onNavigate("brand-identity"); }}
              onApplyContent={handleApplyContent}
              onApplyMedia={handleApplyMedia}
              channelOverrides={channelOverrides}
            />
          )}

          {/* AI Drawer tab content */}
          {rightTab === "ai" && (
            <AIDrawerContent
              brands={brands}
              postContent={postContent}
              channels={channels}
              selectedMedia={selectedMedia}
              onInsert={(content) => setPostContent(content)}
              onInsertMedia={(img) => setSelectedMedia(prev => [...prev, img])}
              onBack={() => setRightTab("preview")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
