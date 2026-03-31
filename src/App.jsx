import { useState } from 'react';
import T from './theme/tokens';
import TopNav from './components/nav/TopNav';
import LeftNav from './components/nav/LeftNav';
import BrandIdentityPage from './components/brand/BrandIdentityPage';
import CreatePostPage from './components/post/CreatePostPage';
import { Monitor } from 'lucide-react';
import { DEFAULT_BRANDS } from './data/brands';

export default function App() {
  const [page, setPage] = useState("createpost");
  const [brands, setBrands] = useState(DEFAULT_BRANDS);

  return (
    <div style={{ fontFamily: T.font, background: "#F5F7FA", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopNav onSettings={() => setPage("brand-identity")} />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <LeftNav activePage={page} onNavigate={setPage} />
        {page === "brand-identity" && <BrandIdentityPage brands={brands} setBrands={setBrands} onNavigate={setPage} />}
        {page === "createpost" && <CreatePostPage brands={brands} onNavigate={setPage} />}
        {page !== "brand-identity" && page !== "createpost" && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "40px" }}>🚧</span>
            <span style={{ fontSize: "15px", color: T.gray500 }}>Navigate to <strong>Social</strong> (post icon) or <strong>Settings</strong> (gear icon) to explore the prototype</span>
          </div>
        )}
      </div>
    </div>
  );
}
