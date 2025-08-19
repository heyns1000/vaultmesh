import { useState } from 'react';
import { Link } from "wouter";
import { navigationMenu } from "@/data/vipUrls";
import { useTheme } from "../hooks/useTheme";
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';

const languageContent = {
  en: { home: 'Home', sectors: 'Sectors', terminal: 'Terminal', packages: 'Packages', agrochain: 'AgroChain', analytics: 'Analytics', login: 'Login', signup: 'Sign Up' },
  es: { home: 'Inicio', sectors: 'Sectores', terminal: 'Terminal', packages: 'Paquetes', agrochain: 'AgroChain', analytics: 'Analíticas', login: 'Iniciar Sesión', signup: 'Registrarse' },
  fr: { home: 'Accueil', sectors: 'Secteurs', terminal: 'Terminal', packages: 'Forfaits', agrochain: 'AgroChain', analytics: 'Analyses', login: 'Connexion', signup: 'S\'inscrire' },
  de: { home: 'Startseite', sectors: 'Sektoren', terminal: 'Terminal', packages: 'Pakete', agrochain: 'AgroChain', analytics: 'Analysen', login: 'Anmelden', signup: 'Registrieren' },
  zh: { home: '首页', sectors: '行业', terminal: '终端', packages: '套餐', agrochain: '农业链', analytics: '分析', login: '登录', signup: '注册' }
};

export default function Header() {
  const { theme, toggleTheme, language, changeLanguage } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const content = languageContent[language as keyof typeof languageContent] || languageContent.en;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-gray-900/95 backdrop-blur border-b border-gray-700 flex items-center justify-between px-4">
      <Link href="/" className="flex items-center space-x-1">
        <Globe className="h-4 w-4 text-cyan-400" />
        <span className="font-bold text-sm text-cyan-400">VaultMesh™</span>
      </Link>

      <nav className="hidden md:flex items-center space-x-3 text-sm">
        <Link href="/" className="text-gray-300 hover:text-cyan-400">{content.home}</Link>
        <Link href="/sectors" className="text-gray-300 hover:text-cyan-400">{content.sectors}</Link>
        <Link href="/terminal" className="text-gray-300 hover:text-cyan-400">{content.terminal}</Link>
        <Link href="/packages" className="text-gray-300 hover:text-cyan-400">{content.packages}</Link>
        <select 
          className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white" 
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en">🇺🇸</option>
          <option value="es">🇪🇸</option>
          <option value="fr">🇫🇷</option>
          <option value="de">🇩🇪</option>
          <option value="zh">🇨🇳</option>
        </select>
      </nav>

      <Button
        variant="ghost"
        size="sm"
        className="md:hidden h-8 w-8 p-0 text-cyan-400"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {mobileMenuOpen && (
        <div className="absolute top-12 left-0 right-0 bg-gray-900/95 backdrop-blur border-b border-gray-700 md:hidden">
          <nav className="flex flex-col p-3 space-y-2">
            <Link href="/" className="text-gray-300 hover:text-cyan-400 py-1" onClick={() => setMobileMenuOpen(false)}>{content.home}</Link>
            <Link href="/sectors" className="text-gray-300 hover:text-cyan-400 py-1" onClick={() => setMobileMenuOpen(false)}>{content.sectors}</Link>
            <Link href="/terminal" className="text-gray-300 hover:text-cyan-400 py-1" onClick={() => setMobileMenuOpen(false)}>{content.terminal}</Link>
            <Link href="/packages" className="text-gray-300 hover:text-cyan-400 py-1" onClick={() => setMobileMenuOpen(false)}>{content.packages}</Link>
            <select 
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white mt-2" 
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="zh">🇨🇳 中文</option>
            </select>
          </nav>
        </div>
      )}
    </header>
  );
}
