import { Home, Mail, Calendar, Star, Megaphone, BarChart3, Users, BookOpen, Layout, Target, Settings } from 'lucide-react';
import T from '../../theme/tokens';

export default function LeftNav({ activePage, onNavigate }) {
  const items = [
    { key: "home", icon: <Home size={18} /> },
    { key: "inbox", icon: <Mail size={18} /> },
    { key: "calendar", icon: <Calendar size={18} /> },
    { key: "star", icon: <Star size={18} /> },
    { key: "mentions", icon: <Megaphone size={18} /> },
    { key: "analytics", icon: <BarChart3 size={18} /> },
    { key: "social", icon: <Users size={18} /> },
    { key: "reviews", icon: <BookOpen size={18} /> },
    { key: "insights", icon: <Layout size={18} /> },
    { key: "competitors", icon: <Target size={18} /> },
    { key: "contacts", icon: <Users size={18} /> },
    { key: "settings", icon: <Settings size={18} /> },
  ];
  return (
    <div style={{ width: "48px", background: T.white, borderRight: `1px solid ${T.gray200}`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "8px", gap: "2px", flexShrink: 0 }}>
      {items.map(item => {
        const active = item.key === activePage || (activePage === "createpost" && item.key === "social") || (activePage === "brand-identity" && item.key === "settings");
        return (
          <button key={item.key} onClick={() => onNavigate(item.key === "social" ? "createpost" : item.key === "settings" ? "brand-identity" : item.key)} style={{
            width: 36, height: 36, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
            background: active ? T.blueLt : "transparent", color: active ? T.blue : T.gray400,
            border: "none", cursor: "pointer", transition: "all 0.15s",
          }}>{item.icon}</button>
        );
      })}
    </div>
  );
}
