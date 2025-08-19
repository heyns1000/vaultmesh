import { Link } from "wouter";
import { useTheme } from "../hooks/useTheme";
import { navigationMenu } from "@/data/vipUrls";

export default function Header() {
  const { theme, toggleTheme, hyperMode, toggleHyperMode, language, changeLanguage } = useTheme();

  // Handle external navigation clicks
  const handleExternalClick = (url: string, external: boolean) => {
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <header className="header">
      <h1>🌐 VaultMesh™ by Fruitful</h1>
      <nav>
        {/* Core VaultMesh Routes */}
        <Link href="/">Home</Link>
        <Link href="/sectors">Sectors</Link>
        <Link href="/terminal">Terminal</Link>
        <Link href="/packages">Packages</Link>
        <Link href="/agrochain">AgroChain</Link>
        <Link href="/analytics">Analytics</Link>
        
        {/* VIP External Links */}
        <a 
          href={navigationMenu.find(item => item.label === 'Features')?.url} 
          className="transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Features
        </a>
        <a 
          href={navigationMenu.find(item => item.label === 'Careers')?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200"
        >
          Careers
        </a>
        <a 
          href={navigationMenu.find(item => item.label === 'SecureSign')?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200 button-style-original"
        >
          SecureSign
        </a>
        <a 
          href={navigationMenu.find(item => item.label === 'Contact Us')?.url}
          target="_blank"
          rel="noopener noreferrer" 
          className="button-style-main"
        >
          Contact Us
        </a>
        
        <Link href="/login" className="button-style-original login-button">Login</Link>
        <Link href="/signup" className="button-style-main">Sign Up</Link>
        
        <div className="theme-language-controls">
          <div className="toggle-container">
            <span>🌞</span>
            <div className="theme-toggle" onClick={toggleTheme}></div>
            <span>🌙</span>
          </div>
          <div className="toggle-container">
            <span>⚡</span>
            <div className="hyper-toggle" onClick={toggleHyperMode}></div>
            <span>💫</span>
          </div>
          <select 
            className="language-select" 
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </nav>
    </header>
  );
}
