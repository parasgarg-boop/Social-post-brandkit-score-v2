import { useState } from 'react';
import { ChevronRight, Plus, HelpCircle, Edit3, ChevronDown } from 'lucide-react';
import T from '../../theme/tokens';
import TagInput from '../ui/TagInput';
import Select from '../ui/Select';
import Pill from '../ui/Pill';
import Btn from '../ui/Btn';
import ColorSwatch from '../ui/ColorSwatch';
import { PERSONALITY_OPTIONS, TONE_OPTIONS, FONT_OPTIONS } from '../../data/brands';

export default function BrandIdentityPage({ brands, setBrands, onNavigate }) {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [scraping, setScraping] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapeProgress, setScrapeProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("identity"); // identity | guardrails

  const handleScrape = () => {
    if (!scrapeUrl) return;
    setScraping(true);
    setScrapeProgress(0);
    const steps = [10, 25, 45, 65, 80, 95, 100];
    steps.forEach((p, i) => {
      setTimeout(() => {
        setScrapeProgress(p);
        if (p === 100) {
          setTimeout(() => setScraping(false), 500);
        }
      }, (i + 1) * 600);
    });
  };

  // List view
  if (!selectedBrand) {
    return (
      <div style={{ flex: 1, overflow: "auto", background: T.white }}>
        <div style={{ padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "16px 0", fontSize: "13px", color: T.gray500 }}>
            <span style={{ color: T.blue, cursor: "pointer" }} onClick={() => onNavigate("settings")}>Settings</span>
            <ChevronRight size={14} />
            <span style={{ color: T.blue, cursor: "pointer" }}>BirdAI</span>
            <ChevronRight size={14} />
            <span style={{ color: T.gray800, fontWeight: 500 }}>Brand Identity</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 600, color: T.gray900, margin: 0 }}>Brand Identity</h1>
            <div style={{ display: "flex", gap: "8px" }}>
              <Btn variant="primary" onClick={() => {
                const newBrand = {
                  id: Date.now(), name: "New Brand", isDefault: false, locations: "All locations",
                  domain: "", logo: "\u{1F3E2}", logoColor: T.blue,
                  voice: { personality: [], tone: [] },
                  kit: { colors: { primary: "#2D68FE", secondary: "#EBF0FF", dark: "#1A1A1A", headerFont: "#FFFFFF", bodyFont: "#1A1A1A", ctaFont: "#FFFFFF" }, fonts: { header: "Inter", headerWeight: "Bold", body: "Inter", bodyWeight: "Regular" }, logos: [] },
                  createdBy: "You", createdOn: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }),
                };
                setBrands(prev => [...prev, newBrand]);
                setSelectedBrand(newBrand);
              }}>
                <span style={{ fontSize: "15px" }}>+</span> Create new
              </Btn>
            </div>
          </div>

          {/* Table */}
          <div style={{ border: `1px solid ${T.gray200}`, borderRadius: T.radius, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: T.gray50 }}>
                  {["Name", "Locations", "Logo", "Colors", "Voice", "Created by", "Created on"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500, color: T.gray500, borderBottom: `1px solid ${T.gray200}`, fontSize: "12px" }}>
                      {h} {(h === "Name" || h === "Created by" || h === "Created on") && <span style={{ fontSize: "10px" }}>{"\u25B4"}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brands.map(b => (
                  <tr key={b.id} onClick={() => setSelectedBrand(b)} style={{ cursor: "pointer", borderBottom: `1px solid ${T.gray100}` }}
                    onMouseOver={e => e.currentTarget.style.background = T.gray50}
                    onMouseOut={e => e.currentTarget.style.background = T.white}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 500, color: T.gray800 }}>{b.name}</span>
                        {b.isDefault && <span style={{ fontSize: "11px", padding: "1px 8px", borderRadius: "4px", background: T.gray100, color: T.gray600 }}>Default</span>}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", color: T.gray600 }}>{b.locations}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ width: 24, height: 24, borderRadius: "4px", background: b.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{b.logo}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: b.kit.colors.primary, border: `1px solid ${T.gray200}` }} />
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: b.kit.colors.secondary || b.kit.colors.dark, border: `1px solid ${T.gray200}` }} />
                        <span style={{ fontSize: "12px", color: T.gray500 }}>+2</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", color: T.gray600 }}>
                      {b.voice.personality[0] || "\u2014"}{b.voice.personality.length > 1 ? `, +${b.voice.personality.length - 1} more` : ""}
                    </td>
                    <td style={{ padding: "14px 16px", color: T.gray600 }}>{b.createdBy}</td>
                    <td style={{ padding: "14px 16px", color: T.gray600 }}>{b.createdOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Detail/edit view
  const updateBrand = (field, value) => {
    const updated = { ...selectedBrand, ...( typeof field === "string" ? { [field]: value } : field ) };
    setSelectedBrand(updated);
    setBrands(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  return (
    <div style={{ flex: 1, overflow: "auto", background: T.white }}>
      <div style={{ padding: "0 32px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "16px 0", fontSize: "13px", color: T.gray500 }}>
          <span style={{ color: T.blue, cursor: "pointer" }} onClick={() => onNavigate("settings")}>Settings</span>
          <ChevronRight size={14} />
          <span style={{ color: T.blue, cursor: "pointer" }} onClick={() => setSelectedBrand(null)}>Brand Identity</span>
          <ChevronRight size={14} />
          <span style={{ color: T.gray800, fontWeight: 500 }}>{selectedBrand.name}</span>
        </div>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 600, color: T.gray900, margin: 0 }}>{selectedBrand.name}</h1>
            <Edit3 size={16} color={T.gray400} style={{ cursor: "pointer" }} />
          </div>
          <Btn variant="secondary" onClick={() => setSelectedBrand(null)}>Save</Btn>
        </div>
        <span style={{ fontSize: "13px", color: T.blue, cursor: "pointer" }}>{selectedBrand.locations}</span>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", borderBottom: `2px solid ${T.gray200}`, marginTop: "20px", marginBottom: "24px" }}>
          {["identity", "guardrails"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "10px 20px", fontSize: "14px", fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? T.blue : T.gray500, background: "none", border: "none",
              borderBottom: activeTab === tab ? `2px solid ${T.blue}` : "2px solid transparent",
              cursor: "pointer", marginBottom: "-2px", textTransform: "capitalize",
            }}>{tab === "identity" ? "Brand Identity" : "Guardrails"}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "32px" }}>
          {/* Left: edit form */}
          <div style={{ flex: 1, maxWidth: "600px", display: "flex", flexDirection: "column", gap: "28px", paddingBottom: "40px" }}>

            {/* Sources */}
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: T.gray900, margin: "0 0 4px" }}>Sources</h3>
              <p style={{ fontSize: "13px", color: T.gray500, margin: "0 0 16px" }}>Add your company website url or other options to import brand voice and kit</p>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: T.gray700 }}>Company URL</span>
                <span style={{ fontSize: "12px", color: T.blue, background: T.blueLt, padding: "1px 6px", borderRadius: "4px", fontWeight: 500 }}>AI</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <input value={scrapeUrl} onChange={e => setScrapeUrl(e.target.value)}
                    placeholder="Enter a URL" style={{
                      width: "100%", padding: "9px 14px", fontSize: "13px", border: `1px solid ${T.gray200}`,
                      borderRadius: T.radiusSm, fontFamily: T.font, outline: "none", boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = T.blue}
                    onBlur={e => e.target.style.borderColor = T.gray200}
                  />
                </div>
                <Btn variant={scrapeUrl ? "primary" : "secondary"} onClick={handleScrape} disabled={!scrapeUrl || scraping}>
                  {scraping ? "Importing..." : "Import"}
                </Btn>
              </div>

              {scraping && (
                <div style={{ marginTop: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", color: T.gray600 }}>
                      {scrapeProgress < 30 ? "Scraping website..." : scrapeProgress < 60 ? "Analyzing brand voice..." : scrapeProgress < 90 ? "Extracting brand kit..." : "Finalizing..."}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: T.blue }}>{scrapeProgress}%</span>
                  </div>
                  <div style={{ height: "4px", background: T.gray100, borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${scrapeProgress}%`, height: "100%", background: T.blue, borderRadius: "4px", transition: "width 0.4s ease" }} />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <span style={{ fontSize: "13px", color: T.gray500 }}>Add</span>
                <span style={{ fontSize: "13px", color: T.blue, cursor: "pointer", fontWeight: 500 }}>PDF</span>
                <span style={{ fontSize: "13px", color: T.gray500 }}>or paste your</span>
                <span style={{ fontSize: "13px", color: T.blue, cursor: "pointer", fontWeight: 500 }}>text</span>
              </div>
            </div>

            {/* Brand Voice */}
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: T.gray900, margin: "0 0 4px" }}>Brand voice</h3>
              <p style={{ fontSize: "13px", color: T.gray500, margin: "0 0 16px" }}>Your brand personality & tone</p>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: T.gray700 }}>Brand personality</span>
                  <HelpCircle size={14} color={T.gray400} />
                </div>
                <TagInput selected={selectedBrand.voice.personality} options={PERSONALITY_OPTIONS}
                  onChange={val => updateBrand({ voice: { ...selectedBrand.voice, personality: val } })}
                  placeholder="Select personality traits" />
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: T.gray700 }}>Tone and writing style</span>
                  <HelpCircle size={14} color={T.gray400} />
                </div>
                <TagInput selected={selectedBrand.voice.tone} options={TONE_OPTIONS}
                  onChange={val => updateBrand({ voice: { ...selectedBrand.voice, tone: val } })}
                  placeholder="Select tone attributes" />
              </div>
            </div>

            {/* Brand Kit */}
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: T.gray900, margin: "0 0 4px" }}>Brand kit</h3>
              <p style={{ fontSize: "13px", color: T.gray500, margin: "0 0 16px" }}>Your brand logos, fonts & colors</p>

              {/* Logos */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: 500, color: T.gray700, marginBottom: "8px" }}>Logos <span style={{ color: T.red }}>*</span></div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <div style={{ width: 88, height: 88, borderRadius: T.radius, background: T.greenLt, border: `2px solid ${T.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>
                    {selectedBrand.logo}
                  </div>
                  <div style={{ width: 88, height: 88, borderRadius: T.radius, border: `2px dashed ${T.gray300}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Plus size={20} color={T.gray400} />
                  </div>
                </div>
                <Select value="light" options={[{value: "light", label: "Light background"}, {value: "dark", label: "Dark background"}]} onChange={() => {}} style={{ width: "160px", marginTop: "8px" }} />
              </div>

              {/* Fonts */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "13px", fontWeight: 500, color: T.gray700, marginBottom: "12px" }}>Fonts</div>
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "12px", color: T.gray500, display: "block", marginBottom: "6px" }}>Header</span>
                    <Select value={selectedBrand.kit.fonts.header} options={FONT_OPTIONS} onChange={v => updateBrand({ kit: { ...selectedBrand.kit, fonts: { ...selectedBrand.kit.fonts, header: v } } })} />
                    <Select value={selectedBrand.kit.fonts.headerWeight} options={["Bold", "Semi-Bold", "Regular", "Light"]} onChange={v => updateBrand({ kit: { ...selectedBrand.kit, fonts: { ...selectedBrand.kit.fonts, headerWeight: v } } })} style={{ marginTop: "6px" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "12px", color: T.gray500, display: "block", marginBottom: "6px" }}>Body</span>
                    <Select value={selectedBrand.kit.fonts.body} options={FONT_OPTIONS} onChange={v => updateBrand({ kit: { ...selectedBrand.kit, fonts: { ...selectedBrand.kit.fonts, body: v } } })} />
                    <Select value={selectedBrand.kit.fonts.bodyWeight} options={["Bold", "Semi-Bold", "Regular", "Light"]} onChange={v => updateBrand({ kit: { ...selectedBrand.kit, fonts: { ...selectedBrand.kit.fonts, bodyWeight: v } } })} style={{ marginTop: "6px" }} />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: T.gray700, marginBottom: "12px" }}>Colors</div>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  {Object.entries(selectedBrand.kit.colors).map(([key, val]) => (
                    <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "11px", color: T.gray500, textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm }}>
                        <div style={{ width: 22, height: 22, borderRadius: "4px", background: val, border: "1px solid rgba(0,0,0,0.1)" }} />
                        <ChevronDown size={12} color={T.gray400} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: preview */}
          <div style={{ width: "380px", flexShrink: 0 }}>
            <div style={{ position: "sticky", top: "20px", background: T.gray50, borderRadius: T.radius, padding: "20px", border: `1px solid ${T.gray200}` }}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: T.gray800, margin: "0 0 4px" }}>Preview</h4>
              <p style={{ fontSize: "12px", color: T.gray500, margin: "0 0 16px" }}>Here are some samples of review responses, social posts & emails generated with your brand voice & kit</p>

              <div style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", fontWeight: 500, color: T.gray600, display: "block", marginBottom: "8px" }}>Social post</span>
                <div style={{ background: T.white, borderRadius: T.radiusSm, border: `1px solid ${T.gray200}`, padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: selectedBrand.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{selectedBrand.logo}</div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: T.gray800 }}>{selectedBrand.name}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: T.gray600, lineHeight: "18px", margin: 0 }}>
                    Welcome to {selectedBrand.name}! We're here to provide you with the best experience.
                    {selectedBrand.voice.personality.length > 0 && ` Our ${selectedBrand.voice.personality[0].toLowerCase()} approach sets us apart.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
