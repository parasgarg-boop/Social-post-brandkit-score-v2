import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Global styles
const style = document.createElement('style');
style.textContent = `
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

createRoot(document.getElementById('root')).render(<App />);
