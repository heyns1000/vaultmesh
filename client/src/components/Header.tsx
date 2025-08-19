import { useState } from 'react';
import { Link } from "wouter";
import { navigationMenu } from "@/data/vipUrls";
import { useTheme } from "../hooks/useTheme";
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';

// Language content mappings
const languageContent = {
  en: {
    home: 'Home',
    sectors: 'Sectors', 
    terminal: 'Terminal',
    packages: 'Packages',
    agrochain: 'AgroChain',
    analytics: 'Analytics',
    features: 'Features',
    careers: 'Careers',
    securesign: 'SecureSign',
    contactus: 'Contact Us',
    login: 'Login',
    signup: 'Sign Up'
  },
  es: {
    home: 'Inicio',
    sectors: 'Sectores',
    terminal: 'Terminal', 
    packages: 'Paquetes',
    agrochain: 'AgroChain',
    analytics: 'Analíticas',
    features: 'Características',
    careers: 'Carreras',
    securesign: 'FirmaSegura',
    contactus: 'Contáctanos',
    login: 'Iniciar Sesión',
    signup: 'Registrarse'
  },
  fr: {
    home: 'Accueil',
    sectors: 'Secteurs',
    terminal: 'Terminal',
    packages: 'Forfaits', 
    agrochain: 'AgroChain',
    analytics: 'Analyses',
    features: 'Fonctionnalités',
    careers: 'Carrières',
    securesign: 'SignatureSecure',
    contactus: 'Contactez-nous',
    login: 'Connexion',
    signup: 'S\'inscrire'
  },
  de: {
    home: 'Startseite',
    sectors: 'Sektoren',
    terminal: 'Terminal',
    packages: 'Pakete',
    agrochain: 'AgroChain', 
    analytics: 'Analysen',
    features: 'Funktionen',
    careers: 'Karriere',
    securesign: 'SicherSign',
    contactus: 'Kontakt',
    login: 'Anmelden',
    signup: 'Registrieren'
  },
  zh: {
    home: '首页',
    sectors: '行业',
    terminal: '终端',
    packages: '套餐',
    agrochain: '农业链',
    analytics: '分析',
    features: '功能',
    careers: '职业',
    securesign: '安全签名',
    contactus: '联系我们',
    login: '登录',
    signup: '注册'
  }
};

export default function Header() {
  const { theme, toggleTheme, hyperMode, toggleHyperMode, language, changeLanguage } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const content = languageContent[language as keyof typeof languageContent] || languageContent.en;

  // Handle external navigation clicks
  const handleExternalClick = (url: string, external: boolean) => {
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <header className="header relative">
      {/* Logo */}
      <h1 className="text-lg md:text-xl font-bold text-cyan-400">
        🌐 VaultMesh™ by Fruitful
      </h1>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden text-cyan-400 hover:bg-gray-800"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        data-testid="mobile-menu-toggle"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Navigation - Desktop */}
      <nav className="hidden md:flex md:items-center md:space-x-4">
        <Link href="/" className="nav-link">{content.home}</Link>
        <Link href="/sectors" className="nav-link">{content.sectors}</Link>
        <Link href="/terminal" className="nav-link">{content.terminal}</Link>
        <Link href="/packages" className="nav-link">{content.packages}</Link>
        <Link href="/agrochain" className="nav-link">{content.agrochain}</Link>
        <Link href="/analytics" className="nav-link">{content.analytics}</Link>
        
        <a 
          href="#features"
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {content.features}
        </a>
        <a 
          href={navigationMenu.find(item => item.label === 'Careers')?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
        >
          {content.careers}
        </a>
        <a 
          href={navigationMenu.find(item => item.label === 'SecureSign')?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="button-style-original text-sm"
        >
          {content.securesign}
        </a>
        <a 
          href={navigationMenu.find(item => item.label === 'Contact Us')?.url}
          target="_blank"
          rel="noopener noreferrer" 
          className="button-style-main text-sm"
        >
          {content.contactus}
        </a>
        
        <Link href="/login" className="button-style-original login-button text-sm">
          {content.login}
        </Link>
        <Link href="/signup" className="button-style-main text-sm">
          {content.signup}
        </Link>

        {/* Theme and Language Controls - Desktop */}
        <div className="theme-language-controls flex items-center space-x-3">
          <div className="toggle-container flex items-center space-x-1">
            <span className="text-xs">🌞</span>
            <div 
              className={`theme-toggle w-8 h-4 rounded-full cursor-pointer transition-colors ${
                theme === 'dark' ? 'bg-blue-600' : 'bg-yellow-400'
              }`}
              onClick={toggleTheme}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                theme === 'dark' ? 'translate-x-4' : 'translate-x-0.5'
              } mt-0.5`} />
            </div>
            <span className="text-xs">🌙</span>
          </div>
          
          <div className="toggle-container flex items-center space-x-1">
            <span className="text-xs">⚡</span>
            <div 
              className={`hyper-toggle w-8 h-4 rounded-full cursor-pointer transition-colors ${
                hyperMode ? 'bg-purple-600' : 'bg-gray-600'
              }`}
              onClick={toggleHyperMode}
            >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                hyperMode ? 'translate-x-4' : 'translate-x-0.5'
              } mt-0.5`} />
            </div>
            <span className="text-xs">💫</span>
          </div>
          
          <div className="relative">
            <select 
              className="language-select bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400" 
              value={language}
              onChange={(e) => {
                changeLanguage(e.target.value);
                console.log(`[VaultMesh] Language switched to: ${e.target.value}`);
              }}
            >
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="zh">🇨🇳 中文</option>
            </select>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-700 md:hidden z-50">
          <nav className="flex flex-col p-4 space-y-3">
            <Link href="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              {content.home}
            </Link>
            <Link href="/sectors" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              {content.sectors}
            </Link>
            <Link href="/terminal" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              {content.terminal}
            </Link>
            <Link href="/packages" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              {content.packages}
            </Link>
            <Link href="/agrochain" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              {content.agrochain}
            </Link>
            <Link href="/analytics" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              {content.analytics}
            </Link>
            
            <div className="border-t border-gray-700 pt-3 mt-3">
              <Link href="/login" className="mobile-nav-link mb-2" onClick={() => setMobileMenuOpen(false)}>
                {content.login}
              </Link>
              <Link href="/signup" className="mobile-nav-link mb-4" onClick={() => setMobileMenuOpen(false)}>
                {content.signup}
              </Link>
              
              {/* Mobile Theme and Language Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Theme</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">🌞</span>
                    <div 
                      className={`theme-toggle w-10 h-5 rounded-full cursor-pointer transition-colors ${
                        theme === 'dark' ? 'bg-blue-600' : 'bg-yellow-400'
                      }`}
                      onClick={toggleTheme}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'
                      } mt-0.5`} />
                    </div>
                    <span className="text-xs">🌙</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Hyper Mode</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">⚡</span>
                    <div 
                      className={`hyper-toggle w-10 h-5 rounded-full cursor-pointer transition-colors ${
                        hyperMode ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                      onClick={toggleHyperMode}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        hyperMode ? 'translate-x-5' : 'translate-x-0.5'
                      } mt-0.5`} />
                    </div>
                    <span className="text-xs">💫</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Language</span>
                  <select 
                    className="language-select bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm text-white cursor-pointer" 
                    value={language}
                    onChange={(e) => {
                      changeLanguage(e.target.value);
                      console.log(`[VaultMesh Mobile] Language switched to: ${e.target.value}`);
                    }}
                  >
                    <option value="en">🇺🇸 English</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="zh">🇨🇳 中文</option>
                  </select>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
