import { useState, useEffect } from 'react';
import { Link, useLocation } from "wouter";
import { navigationMenu } from "@/data/vipUrls";
import { useTheme } from "../hooks/useTheme";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu, X, Globe, Sun, Moon, Zap, Sparkles, Home, Terminal, Package, BarChart3, Wheat } from 'lucide-react';

// Enhanced language content with more comprehensive translations
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
    signup: 'Sign Up',
    menu: 'Menu',
    theme: 'Theme',
    hyperMode: 'Hyper Mode',
    language: 'Language',
    close: 'Close'
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
    signup: 'Registrarse',
    menu: 'Menú',
    theme: 'Tema',
    hyperMode: 'Modo Híper',
    language: 'Idioma',
    close: 'Cerrar'
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
    signup: 'S\'inscrire',
    menu: 'Menu',
    theme: 'Thème',
    hyperMode: 'Mode Hyper',
    language: 'Langue',
    close: 'Fermer'
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
    signup: 'Registrieren',
    menu: 'Menü',
    theme: 'Design',
    hyperMode: 'Hyper-Modus',
    language: 'Sprache',
    close: 'Schließen'
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
    signup: '注册',
    menu: '菜单',
    theme: '主题',
    hyperMode: '超级模式',
    language: '语言',
    close: '关闭'
  }
};

interface MobileHeaderProps {
  className?: string;
}

export default function MobileHeader({ className = '' }: MobileHeaderProps) {
  const { theme, toggleTheme, hyperMode, toggleHyperMode, language, changeLanguage } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const content = languageContent[language as keyof typeof languageContent] || languageContent.en;

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    { href: '/', label: content.home, icon: Home },
    { href: '/sectors', label: content.sectors, icon: BarChart3 },
    { href: '/terminal', label: content.terminal, icon: Terminal },
    { href: '/packages', label: content.packages, icon: Package },
    { href: '/agrochain', label: content.agrochain, icon: Wheat },
    { href: '/analytics', label: content.analytics, icon: BarChart3 },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2" onClick={handleNavClick}>
          <Globe className="h-6 w-6 text-cyan-400" />
          <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            VaultMesh™
          </span>
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            data-testid="theme-toggle"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4 text-blue-500" />
            )}
          </Button>

          {/* Hyper Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleHyperMode}
            className={`h-9 w-9 ${hyperMode ? 'text-purple-500' : 'text-gray-500'}`}
            data-testid="hyper-toggle"
          >
            {hyperMode ? <Sparkles className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
          </Button>

          {/* Language Selector */}
          <select 
            className="bg-background border border-input rounded-md px-3 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring" 
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">🇺🇸 EN</option>
            <option value="es">🇪🇸 ES</option>
            <option value="fr">🇫🇷 FR</option>
            <option value="de">🇩🇪 DE</option>
            <option value="zh">🇨🇳 ZH</option>
          </select>

          {/* Auth Buttons */}
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-sm">
              {content.login}
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="text-sm">
              {content.signup}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10"
              data-testid="mobile-menu-trigger"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{content.menu}</span>
            </Button>
          </SheetTrigger>
          
          <SheetContent 
            side="right" 
            className="w-[300px] sm:w-[350px] bg-background/95 backdrop-blur"
          >
            <SheetHeader>
              <SheetTitle className="flex items-center space-x-2 text-left">
                <Globe className="h-5 w-5 text-cyan-400" />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  VaultMesh™
                </span>
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Navigation Links */}
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                      data-testid={`mobile-nav-${item.href.replace('/', '') || 'home'}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t pt-6">
                {/* Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">{content.theme}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTheme}
                      className="h-8 w-8 p-0"
                    >
                      {theme === 'dark' ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">{content.hyperMode}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{hyperMode ? 'On' : 'Off'}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleHyperMode}
                      className={`h-8 w-8 p-0 ${hyperMode ? 'text-purple-500' : ''}`}
                    >
                      {hyperMode ? <Sparkles className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">{content.language}</h4>
                  <select 
                    className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring" 
                    value={language}
                    onChange={(e) => changeLanguage(e.target.value)}
                  >
                    <option value="en">🇺🇸 English</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="zh">🇨🇳 中文</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-6">
                {/* Auth Buttons */}
                <div className="space-y-2">
                  <Link href="/login" onClick={handleNavClick} className="w-full">
                    <Button variant="ghost" className="w-full justify-start">
                      {content.login}
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={handleNavClick} className="w-full">
                    <Button className="w-full justify-start">
                      {content.signup}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}