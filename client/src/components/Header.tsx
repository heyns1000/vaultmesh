import { Link } from "wouter";
import { useTheme } from "../hooks/useTheme";

export default function Header() {
  const { theme, toggleTheme, hyperMode, toggleHyperMode, language, changeLanguage } = useTheme();

  return (
    <header className="header">
      <h1>🌐 VaultMesh™ by Fruitful</h1>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/sectors">Sectors</Link>
        <Link href="/terminal">Terminal</Link>
        <Link href="/packages">Packages</Link>
        <Link href="/agrochain">AgroChain</Link>
        <Link href="/analytics">Analytics</Link>
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
