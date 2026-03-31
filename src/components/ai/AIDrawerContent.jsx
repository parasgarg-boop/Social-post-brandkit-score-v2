import { useState, useRef } from 'react';
import { Sparkles, ArrowLeft, Send, RefreshCw, ChevronRight, ExternalLink, FileText, Image, X, Check } from 'lucide-react';
import T from '../../theme/tokens';
import Btn from '../ui/Btn';
import { AI_MENU, TONE_OPTIONS_AI, SUGGESTED_TOPICS, mockAIGenerate } from '../../data/ai';
import { AI_IMAGE_SUGGESTIONS } from '../../data/media';

export default function AIDrawerContent({ brands, postContent, channels, selectedMedia, onInsert, onInsertMedia, onBack }) {
  const [aiMode, setAiMode] = useState(null); // null = menu, "ideas", "generate", "tone", etc.
  const [selectedBrand, setSelectedBrand] = useState(brands[0]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [briefText, setBriefText] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [uploadedRefImages, setUploadedRefImages] = useState([]);
  const [selectedTone, setSelectedTone] = useState(null);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeImageSuggestions, setIncludeImageSuggestions] = useState(true);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generatedIdeas, setGeneratedIdeas] = useState(null);
  const [generatedHashtags, setGeneratedHashtags] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const fileInputRef = useRef(null);
  const imgInputRef = useRef(null);

  const handleGenerate = (mode, opts = {}) => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = mockAIGenerate({
        mode: mode || "generate",
        prompt: aiPrompt || opts.prompt,
        brand: selectedBrand,
        tone: opts.tone || selectedTone,
        existingContent: postContent,
        briefText,
        channels,
      });
      if (mode === "ideas") setGeneratedIdeas(result);
      else if (mode === "hashtags") setGeneratedHashtags(result);
      else setGeneratedContent(result);
      setIsGenerating(false);
    }, 1500);
  };

  const handleDocUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      setUploadedDocs(prev => [...prev, { id: Date.now() + Math.random(), name: file.name, size: (file.size / 1024).toFixed(1) + " KB", type: file.type }]);
    });
    e.target.value = "";
  };

  const handleRefImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedRefImages(prev => [...prev, { id: Date.now() + Math.random(), name: file.name, dataUrl: ev.target.result }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const resetAll = () => {
    setAiMode(null); setGeneratedContent(null); setGeneratedIdeas(null);
    setGeneratedHashtags(null); setSelectedIdea(null); setAiPrompt("");
  };

  /* --- AI Menu (home) --- */
  if (!aiMode) {
    return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.gray100}`, display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ width: 24, height: 24, borderRadius: "6px", background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={13} color={T.white} />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 600, color: T.gray900 }}>BirdAI</span>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "12px 18px" }}>
          {/* Generate section */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: T.gray400, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Generate</div>
            {AI_MENU.generate.map(item => (
              <button key={item.id} onClick={() => {
                if (item.id === "ideas") { setAiMode("ideas"); handleGenerate("ideas"); }
                else if (item.id === "hashtags") { setAiMode("hashtags"); handleGenerate("hashtags"); }
                else if (item.id === "images") setAiMode("images");
                else setAiMode("generate");
              }} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 8px",
                background: "none", border: "none", cursor: "pointer", borderRadius: T.radiusSm, textAlign: "left",
              }} onMouseOver={e => e.currentTarget.style.background = T.gray50} onMouseOut={e => e.currentTarget.style.background = "none"}>
                <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>{item.icon}</span>
                <span style={{ fontSize: "13px", fontWeight: 500, color: T.gray800 }}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Modify section */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: T.gray400, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Modify</div>
            {AI_MENU.modify.map(item => (
              <button key={item.id} onClick={() => {
                if (item.id === "tone") setAiMode("tone");
                else { setAiMode(item.id); handleGenerate(item.id); }
              }} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 8px",
                background: "none", border: "none", cursor: "pointer", borderRadius: T.radiusSm, textAlign: "left",
              }} onMouseOver={e => e.currentTarget.style.background = T.gray50} onMouseOut={e => e.currentTarget.style.background = "none"}>
                <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>{item.icon}</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: T.gray800 }}>{item.label}</span>
                  {item.hasSub && <ChevronRight size={14} color={T.gray400} />}
                </div>
              </button>
            ))}
          </div>

          {/* Configure section */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: T.gray400, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Configure</div>
            {AI_MENU.configure.map(item => (
              <button key={item.id} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 8px",
                background: "none", border: "none", cursor: "pointer", borderRadius: T.radiusSm, textAlign: "left",
              }} onMouseOver={e => e.currentTarget.style.background = T.gray50} onMouseOut={e => e.currentTarget.style.background = "none"}>
                <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>{item.icon}</span>
                <span style={{ fontSize: "13px", fontWeight: 500, color: T.gray800 }}>{item.label}</span>
                {item.external && <ExternalLink size={12} color={T.gray400} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* --- Post Ideas --- */
  if (aiMode === "ideas") {
    return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.gray100}`, display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <button onClick={resetAll} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><ArrowLeft size={18} color={T.gray600} /></button>
          <span style={{ fontSize: "14px", fontWeight: 600, color: T.gray900, flex: 1 }}>Post ideas</span>
          <Btn variant={selectedIdea !== null ? "primary" : "secondary"} disabled={selectedIdea === null} onClick={() => { if (selectedIdea !== null) { onInsert(generatedIdeas[selectedIdea]); resetAll(); onBack(); } }}>Insert</Btn>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "16px 18px" }}>
          {/* Prompt input */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, padding: "8px 12px", alignItems: "center" }}>
            <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Tell BirdAI what you want to create" style={{ flex: 1, border: "none", outline: "none", fontSize: "13px", fontFamily: T.font, color: T.gray700 }}
              onKeyDown={e => { if (e.key === "Enter") handleGenerate("ideas"); }} />
            <button onClick={() => handleGenerate("ideas")} style={{ background: aiPrompt ? `linear-gradient(135deg, ${T.blue}, ${T.purple})` : T.gray200, border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: aiPrompt ? "pointer" : "default" }}>
              <Send size={13} color={aiPrompt ? T.white : T.gray400} />
            </button>
          </div>

          {isGenerating ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
              <RefreshCw size={20} color={T.blue} style={{ animation: "spin 1s linear infinite" }} />
            </div>
          ) : generatedIdeas && (
            <>
              <div style={{ fontSize: "13px", fontWeight: 600, color: T.gray800, marginBottom: "12px" }}>Suggested topics</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {generatedIdeas.map((idea, i) => (
                  <button key={i} onClick={() => setSelectedIdea(i)} style={{
                    width: "100%", textAlign: "left", padding: "12px 14px", background: selectedIdea === i ? T.blueLt : "none",
                    border: `1px solid ${selectedIdea === i ? T.blue : "transparent"}`, borderRadius: T.radiusSm, cursor: "pointer",
                    fontSize: "13px", color: T.gray700, lineHeight: "20px",
                  }} onMouseOver={e => { if (selectedIdea !== i) e.currentTarget.style.background = T.gray50; }}
                     onMouseOut={e => { if (selectedIdea !== i) e.currentTarget.style.background = "none"; }}>
                    {idea}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* --- Hashtags --- */
  if (aiMode === "hashtags") {
    return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.gray100}`, display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <button onClick={resetAll} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><ArrowLeft size={18} color={T.gray600} /></button>
          <span style={{ fontSize: "14px", fontWeight: 600, color: T.gray900, flex: 1 }}>Hashtags</span>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "16px 18px" }}>
          {isGenerating ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
              <RefreshCw size={20} color={T.blue} style={{ animation: "spin 1s linear infinite" }} />
            </div>
          ) : generatedHashtags && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {generatedHashtags.map((tag, i) => (
                <button key={i} onClick={() => { onInsert(postContent ? postContent + " " + tag : tag); }}
                  style={{ padding: "6px 14px", background: T.blueLt, color: T.blue, border: `1px solid ${T.blueMd}`, borderRadius: "16px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
                  onMouseOver={e => e.currentTarget.style.background = T.blueMd} onMouseOut={e => e.currentTarget.style.background = T.blueLt}>
                  {tag}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => handleGenerate("hashtags")} style={{ marginTop: "16px", background: "none", border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, padding: "8px 14px", fontSize: "12px", color: T.gray600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <RefreshCw size={12} /> Regenerate
          </button>
        </div>
      </div>
    );
  }

  /* --- Tone selector --- */
  if (aiMode === "tone") {
    return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.gray100}`, display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <button onClick={resetAll} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><ArrowLeft size={18} color={T.gray600} /></button>
          <span style={{ fontSize: "14px", fontWeight: 600, color: T.gray900, flex: 1 }}>Change tone</span>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "16px 18px" }}>
          {!generatedContent ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {TONE_OPTIONS_AI.map(t => (
                <button key={t} onClick={() => { setSelectedTone(t); handleGenerate("tone", { tone: t }); }}
                  style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, cursor: "pointer", fontSize: "13px", color: T.gray700 }}
                  onMouseOver={e => { e.currentTarget.style.background = T.gray50; e.currentTarget.style.borderColor = T.blue; }}
                  onMouseOut={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = T.gray200; }}>
                  {t}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div style={{ fontSize: "12px", color: T.gray500, marginBottom: "8px" }}>Tone: <strong>{selectedTone}</strong></div>
              <div style={{ padding: "14px", background: T.gray50, borderRadius: T.radius, border: `1px solid ${T.gray200}`, fontSize: "13px", color: T.gray700, lineHeight: "20px", whiteSpace: "pre-wrap", marginBottom: "14px" }}>
                {generatedContent}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Btn variant="primary" onClick={() => { onInsert(generatedContent); resetAll(); onBack(); }}>Insert</Btn>
                <Btn variant="secondary" onClick={() => setGeneratedContent(null)}>Try another tone</Btn>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* --- Modify modes (shorter, longer, grammar) --- */
  if (["shorter", "longer", "grammar"].includes(aiMode)) {
    const modeLabels = { shorter: "Make shorter", longer: "Make longer", grammar: "Fix spelling and grammar" };
    return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.gray100}`, display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <button onClick={resetAll} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><ArrowLeft size={18} color={T.gray600} /></button>
          <span style={{ fontSize: "14px", fontWeight: 600, color: T.gray900, flex: 1 }}>{modeLabels[aiMode]}</span>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "16px 18px" }}>
          {isGenerating ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
              <RefreshCw size={20} color={T.blue} style={{ animation: "spin 1s linear infinite" }} />
            </div>
          ) : generatedContent ? (
            <>
              <div style={{ fontSize: "12px", color: T.gray500, marginBottom: "4px" }}>AI credits remaining: <strong>4 of 5</strong></div>
              <div style={{ padding: "14px", background: T.blueLt, borderRadius: T.radius, border: `1px solid ${T.blueMd}`, fontSize: "13px", color: T.gray700, lineHeight: "20px", whiteSpace: "pre-wrap", marginBottom: "14px", position: "relative" }}>
                <div style={{ position: "absolute", top: "8px", left: "8px", width: 18, height: 18, borderRadius: "50%", border: `2px solid ${T.blue}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.blue }} />
                </div>
                <div style={{ paddingLeft: "28px" }}>{generatedContent}</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Btn variant="primary" onClick={() => { onInsert(generatedContent); resetAll(); onBack(); }}>Insert</Btn>
                <Btn variant="secondary" onClick={() => { setGeneratedContent(null); handleGenerate(aiMode); }}>Regenerate</Btn>
              </div>
            </>
          ) : (
            <p style={{ fontSize: "13px", color: T.gray500 }}>No content to modify. Write some content first.</p>
          )}
        </div>
      </div>
    );
  }

  /* --- AI Image suggestions --- */
  if (aiMode === "images") {
    return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.gray100}`, display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <button onClick={resetAll} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><ArrowLeft size={18} color={T.gray600} /></button>
          <span style={{ fontSize: "14px", fontWeight: 600, color: T.gray900, flex: 1 }}>Image suggestions</span>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "16px 18px" }}>
          <p style={{ fontSize: "12px", color: T.gray500, margin: "0 0 14px" }}>Suggested images from <span style={{ color: T.blue, fontWeight: 500 }}>Pexels</span> based on your content</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {AI_IMAGE_SUGGESTIONS.map(img => (
              <button key={img.id} onClick={() => { onInsertMedia(img); }} style={{
                background: img.gradient, border: `2px solid transparent`, borderRadius: T.radius, height: "90px",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", overflow: "hidden",
              }} onMouseOver={e => e.currentTarget.style.borderColor = T.blue} onMouseOut={e => e.currentTarget.style.borderColor = "transparent"}>
                <span style={{ fontSize: "28px" }}>{img.emoji}</span>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.5)", padding: "3px 6px" }}>
                  <span style={{ fontSize: "10px", color: "white" }}>{img.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* --- Full Generate mode (from prompt + campaign brief) --- */
  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.gray100}`, display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <button onClick={resetAll} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><ArrowLeft size={18} color={T.gray600} /></button>
        <span style={{ fontSize: "14px", fontWeight: 600, color: T.gray900, flex: 1 }}>Generate post</span>
        {generatedContent && <Btn variant="primary" onClick={() => { onInsert(generatedContent); resetAll(); onBack(); }}>Insert</Btn>}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Prompt */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 600, color: T.gray600, display: "block", marginBottom: "6px" }}>What do you want to create?</label>
          <div style={{ display: "flex", gap: "8px", border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, padding: "8px 12px", alignItems: "center" }}>
            <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="E.g. Spring lawn care promotion with a seasonal discount"
              style={{ flex: 1, border: "none", outline: "none", fontSize: "13px", fontFamily: T.font, color: T.gray700 }}
              onKeyDown={e => { if (e.key === "Enter") handleGenerate("generate"); }} />
            <button onClick={() => handleGenerate("generate")} style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <Send size={13} color={T.white} />
            </button>
          </div>
        </div>

        {/* Campaign brief */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 600, color: T.gray600, display: "block", marginBottom: "6px" }}>Campaign brief / additional context</label>
          <textarea value={briefText} onChange={e => setBriefText(e.target.value)} placeholder="Paste your campaign brief, event details, promotion info, or any reference text..."
            style={{ width: "100%", minHeight: "80px", padding: "10px 12px", border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, fontSize: "13px", fontFamily: T.font, color: T.gray700, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* Uploads row */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 600, color: T.gray600, display: "block", marginBottom: "6px" }}>Reference materials</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx,.txt" multiple style={{ display: "none" }} onChange={handleDocUpload} />
            <button onClick={() => fileInputRef.current?.click()} style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: T.gray50,
              border: `1px dashed ${T.gray300}`, borderRadius: T.radiusSm, cursor: "pointer", fontSize: "12px", color: T.gray600,
            }}><FileText size={14} color={T.gray500} /> Upload document</button>

            <input type="file" ref={imgInputRef} accept="image/*" multiple style={{ display: "none" }} onChange={handleRefImageUpload} />
            <button onClick={() => imgInputRef.current?.click()} style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: T.gray50,
              border: `1px dashed ${T.gray300}`, borderRadius: T.radiusSm, cursor: "pointer", fontSize: "12px", color: T.gray600,
            }}><Image size={14} color={T.gray500} /> Upload image</button>
          </div>

          {/* Uploaded files list */}
          {(uploadedDocs.length > 0 || uploadedRefImages.length > 0) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
              {uploadedDocs.map(doc => (
                <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", background: T.gray50, borderRadius: "12px", border: `1px solid ${T.gray200}`, fontSize: "11px", color: T.gray600 }}>
                  <FileText size={12} color={T.gray500} /> {doc.name}
                  <button onClick={() => setUploadedDocs(prev => prev.filter(d => d.id !== doc.id))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}><X size={10} color={T.gray400} /></button>
                </div>
              ))}
              {uploadedRefImages.map(img => (
                <div key={img.id} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", background: T.gray50, borderRadius: "12px", border: `1px solid ${T.gray200}`, fontSize: "11px", color: T.gray600 }}>
                  <Image size={12} color={T.gray500} /> {img.name}
                  <button onClick={() => setUploadedRefImages(prev => prev.filter(i => i.id !== img.id))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}><X size={10} color={T.gray400} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brand identity selector */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 600, color: T.gray600, display: "block", marginBottom: "6px" }}>Brand identity</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {brands.map(b => (
              <button key={b.id} onClick={() => setSelectedBrand(b)} style={{
                display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px",
                background: b.id === selectedBrand.id ? T.blueLt : T.white,
                border: `1px solid ${b.id === selectedBrand.id ? T.blue : T.gray200}`,
                borderRadius: T.radiusSm, cursor: "pointer", fontSize: "12px", color: b.id === selectedBrand.id ? T.blue : T.gray700, fontWeight: 500,
              }}>
                <span>{b.logo}</span> {b.name}
              </button>
            ))}
          </div>
        </div>

        {/* Options toggles */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 600, color: T.gray600, display: "block", marginBottom: "8px" }}>Include:</label>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            {[{ label: "Emojis", val: includeEmojis, set: setIncludeEmojis }, { label: "Hashtags", val: includeHashtags, set: setIncludeHashtags }, { label: "Image suggestions", val: includeImageSuggestions, set: setIncludeImageSuggestions }].map(opt => (
              <label key={opt.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: T.gray700, cursor: "pointer" }}>
                <div onClick={() => opt.set(!opt.val)} style={{
                  width: 16, height: 16, borderRadius: "3px",
                  background: opt.val ? T.blue : T.white,
                  border: `2px solid ${opt.val ? T.blue : T.gray300}`,
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}>
                  {opt.val && <Check size={10} color={T.white} />}
                </div>
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Generated result */}
        {isGenerating && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "30px" }}>
            <RefreshCw size={20} color={T.blue} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ marginLeft: "10px", fontSize: "13px", color: T.gray500 }}>Generating content...</span>
          </div>
        )}

        {generatedContent && !isGenerating && (
          <>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: T.gray500 }}>AI credits remaining: <strong>4 of 5</strong></span>
              </div>
              <div style={{ padding: "14px", background: T.blueLt, borderRadius: T.radius, border: `1px solid ${T.blueMd}`, fontSize: "13px", color: T.gray700, lineHeight: "20px", whiteSpace: "pre-wrap", position: "relative" }}>
                <div style={{ position: "absolute", top: "10px", left: "10px", width: 18, height: 18, borderRadius: "50%", border: `2px solid ${T.blue}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.blue }} />
                </div>
                <div style={{ paddingLeft: "28px" }}>{generatedContent}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <Btn variant="primary" onClick={() => { onInsert(generatedContent); resetAll(); onBack(); }}>Insert</Btn>
              <Btn variant="secondary" onClick={() => { setGeneratedContent(null); handleGenerate("generate"); }}>Regenerate</Btn>
            </div>

            {/* Image suggestions */}
            {includeImageSuggestions && (
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: T.gray800, marginBottom: "8px" }}>Suggested images from <span style={{ color: T.blue }}>Pexels</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  {AI_IMAGE_SUGGESTIONS.slice(0, 6).map(img => (
                    <button key={img.id} onClick={() => onInsertMedia(img)} style={{
                      background: img.gradient, border: `2px solid transparent`, borderRadius: T.radius, height: "80px",
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", overflow: "hidden",
                    }} onMouseOver={e => e.currentTarget.style.borderColor = T.blue} onMouseOut={e => e.currentTarget.style.borderColor = "transparent"}>
                      <span style={{ fontSize: "24px" }}>{img.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
