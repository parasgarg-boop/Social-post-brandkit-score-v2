import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import T from '../../theme/tokens';
import Btn from '../ui/Btn';

export default function SchedulePickerModal({ onSchedule, onClose, initialDate, initialTime }) {
  const [date, setDate] = useState(initialDate || new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(initialTime || "10:00");
  const [timezone, setTimezone] = useState("America/New_York");
  const tzLabels = { "America/New_York": "Eastern (ET)", "America/Chicago": "Central (CT)", "America/Denver": "Mountain (MT)", "America/Los_Angeles": "Pacific (PT)", "UTC": "UTC" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "380px", background: T.white, borderRadius: T.radius, boxShadow: T.shadowLg }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.gray200}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={18} color={T.blue} />
            <span style={{ fontSize: "15px", fontWeight: 600, color: T.gray900 }}>Schedule Post</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={T.gray500} /></button>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 500, color: T.gray600, display: "block", marginBottom: "6px" }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{
              width: "100%", padding: "10px 12px", border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm,
              fontSize: "14px", fontFamily: T.font, outline: "none", boxSizing: "border-box",
            }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 500, color: T.gray600, display: "block", marginBottom: "6px" }}>Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{
              width: "100%", padding: "10px 12px", border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm,
              fontSize: "14px", fontFamily: T.font, outline: "none", boxSizing: "border-box",
            }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 500, color: T.gray600, display: "block", marginBottom: "6px" }}>Timezone</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{
              width: "100%", padding: "9px 14px", fontSize: "13px", color: T.gray800,
              border: `1px solid ${T.gray200}`, borderRadius: T.radiusSm, background: T.white,
              fontFamily: T.font, outline: "none", cursor: "pointer", boxSizing: "border-box",
            }}>
              {Object.entries(tzLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div style={{ padding: "10px 12px", background: T.blueLt, borderRadius: T.radiusSm }}>
            <p style={{ fontSize: "13px", color: T.blue, margin: 0, fontWeight: 500 }}>
              <Clock size={13} style={{ verticalAlign: "middle", marginRight: "6px" }} />
              Scheduled for {new Date(date + "T" + time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {time} {tzLabels[timezone]}
            </p>
          </div>
        </div>
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.gray200}`, display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Btn onClick={onClose}>Cancel</Btn>
          <Btn variant="primary" onClick={() => { onSchedule(date, time, timezone); onClose(); }}>
            <Calendar size={14} /> Confirm Schedule
          </Btn>
        </div>
      </div>
    </div>
  );
}
