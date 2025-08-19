// VIP URLs and Navigation Links from Original VaultMesh HTML
// These are critical navigation elements that must be preserved exactly

export const vipNavigationUrls = {
  // Primary Navigation from Header
  home: "fruitful.faa.zone/index.html",
  features: "#features",
  signal: "#shareprice", 
  vault: "#vault-access",
  treaty: "#treaty",
  vaultmesh: "#vaultmesh",
  about: "#about",
  careers: "https://faa.zone/careers/hiring-homepage.html",
  securesign: "https://faa.zone/legal/securesign.html",
  contactUs: "https://faa.zone/contact-us.html"
};

export const heroSectionUrls = {
  // Hero Section VIP Action Buttons
  omnigrid: "https://faa.zone/omnigrid",
  fruitful: "https://fruitful.faa.zone",
  baobab: "https://baobab.faa.zone", 
  crateDance: "https://fruitfulcratedance.com/",
  globalPackages: "https://vaultmesh.faa.zone/fruitful-brand-packages.html",
  ecosystemDashboard: "https://seedwave.faa.zone/ecosystem-dashboard.html",
  takealot: "https://sellers.takealot.com/",
  vaultEmail: "https://www.zoho.com/",
  paypalAccess: "https://www.paypal.com/signin/",
  vercelAccess: "https://vercel.com/faa-systems-projects/",
  hetznerCloud: "https://accounts.hetzner.com/account/masterdata",
  legalAccess: "https://faa.zone/legal/",
  sageAccess: "https://accounting.sageone.co.za/Maintenance/OpenAndManageCompanyMaintenance.aspx",
  alibabaAccount: "https://login.alibaba.com/newlogin/icbuLogin.htm?defaultActive=signIn&return_url=https%3A%2F%2Fwww.alibaba.com%2F%3Fsrc%3Dsem_ggl%26field%3DUG%26from%3Dsem_ggl%26cmpgn%3D9922923274%26adgrp%3D97780323342%26fditm%3D%26tgt%3Dkwd-482944541254%26locintrst%3D%26locphyscl%3D1028682%26mtchtyp%3De%26ntwrk%3Dg%26device%3Dc%26dvcmdl%3D%26creative%3D598857653475%26plcmnt%3D%26plcmntcat%3D%26aceid%3D%26position%3D%26gad_source%3D1%26gad_campaignid%3D9922923274%26gbraid%3D0AAAAAD8m77qRAZex2ej01gArx6VezE9m5%26gclid%3DCjwKCAjw6s7CBhACEiwAuHQckkoZ8x6add65vgObqo7p06J8PMrqd9Jj5d3QDQk02m9K2MLM2Q3hURoCWgkQAvD_BwE&_lang=en_US",
  homemart: "https://homemart.africa/",
  gemini: "https://gemini.google.com/",
  banimal: "https://www.clmhosting.co.za/banimal/",
  seedwave: "https://seedwave.faa.zone/global.html",
  respitories: "https://legal.faa.zone/respitories/index.html",
  replitFruitful: "https://replit.com/t/fruitful-global/",
  xeroLogin: "https://login.xero.com/identity/user/login",
  gmailInbox: "https://mail.google.com/mail/u/0/#inbox",
  fnbBank: "https://www.fnb.co.za/"
};

export const terminalUrls = {
  // Terminal Access URLs - Sector Terminals
  vaultMaster: "vault-master.html",
  cubeLattice: "cube-lattice.html", 
  globalView: "global-view.html",
  freightOps: "freight-ops.html",
  loopWatch: "loop-watch.html",
  seedwaveTerminal: "seedwave.html",
  distribution: "distribution.html",
  signal: "signal.html",
  faaBrands: "faa-brands.html"
};

export const sectorUrls = {
  // Sector Scrolls - Will be dynamically loaded
  sectors: [] as string[] // To be populated from sectors data
};

export const adminPanelUrls = {
  // Admin Panel Access Points
  xeroAdmin: "https://seedwave.faa.zone/admin_panel_xero.html",
  signup: "https://seedwave.faa.zone/signup.html"
};

export const externalUrls = {
  // External VIP Links
  googleMapsApi: "AIzaSyBPG8dG29cl0TvYRGyLozejGed5Wj5Ab80",
  googleFonts: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
  tailwindCdn: "https://cdn.tailwindcss.com",
  chartJs: "https://cdn.jsdelivr.net/npm/chart.js"
};

// VIP Button Configuration - Organized by Function Groups
export const vipButtons = [
  // Core Infrastructure (Primary)
  {
    id: "omnigrid",
    label: "🌐 OmniGrid",
    url: heroSectionUrls.omnigrid,
    type: "primary",
    description: "Explore OmniGrid Infrastructure"
  },
  {
    id: "globalPackages",
    label: "📦 Global Packages",
    url: heroSectionUrls.globalPackages,
    type: "primary",
    description: "VaultMesh Fruitful Brand Packages"
  },
  {
    id: "replitFruitful",
    label: "🔧 Replit Fruitful",
    url: heroSectionUrls.replitFruitful,
    type: "primary",
    description: "Fruitful Global Replit Team"
  },

  // Development & Tech Platforms
  {
    id: "vercelAccess",
    label: "⚡ Vercel Access",
    url: heroSectionUrls.vercelAccess,
    type: "secondary",
    description: "FAA Systems Vercel Projects"
  },
  {
    id: "hetznerCloud",
    label: "☁️ Hetzner Cloud",
    url: heroSectionUrls.hetznerCloud,
    type: "secondary",
    description: "Hetzner Account Management"
  },
  {
    id: "gemini",
    label: "🤖 Gemini",
    url: heroSectionUrls.gemini,
    type: "secondary",
    description: "Google Gemini AI"
  },

  // Accounting & Finance
  {
    id: "xeroLogin",
    label: "💼 Xero Login",
    url: heroSectionUrls.xeroLogin,
    type: "secondary",
    description: "Xero Accounting Platform Access"
  },
  {
    id: "sageAccess", 
    label: "💼 Sage Access",
    url: heroSectionUrls.sageAccess,
    type: "secondary",
    description: "Sage Accounting Platform"
  },
  {
    id: "paypalAccess",
    label: "💳 PayPal Access",
    url: heroSectionUrls.paypalAccess,
    type: "secondary", 
    description: "PayPal Account Login"
  },
  {
    id: "fnbBank",
    label: "🏦 FNB Banking",
    url: heroSectionUrls.fnbBank,
    type: "secondary",
    description: "First National Bank Online Banking"
  },

  // Business & E-commerce
  {
    id: "takealot",
    label: "🛒 Takealot Sellers",
    url: heroSectionUrls.takealot,
    type: "secondary",
    description: "Takealot Seller Portal"
  },
  {
    id: "alibabaAccount",
    label: "🏪 Alibaba Account",
    url: heroSectionUrls.alibabaAccount,
    type: "secondary",
    description: "Alibaba Business Account"
  },
  {
    id: "homemart",
    label: "🏠 Homemart",
    url: heroSectionUrls.homemart,
    type: "secondary",
    description: "Homemart Africa Platform"
  },

  // Communication & Email
  {
    id: "gmailInbox",
    label: "📧 Gmail Inbox",
    url: heroSectionUrls.gmailInbox,
    type: "secondary",
    description: "Personal Gmail Landing Page Inbox"
  },
  {
    id: "vaultEmail",
    label: "📧 Vault Email",
    url: heroSectionUrls.vaultEmail,
    type: "secondary",
    description: "Zoho Email Access"
  },

  // Legal & Documentation
  {
    id: "legalAccess",
    label: "⚖️ Legal Access",
    url: heroSectionUrls.legalAccess,
    type: "secondary",
    description: "FAA Legal Documentation"
  },
  {
    id: "respitories",
    label: "📚 Respitories™",
    url: heroSectionUrls.respitories,
    type: "secondary",
    description: "Legal Respitories Index"
  },

  // Platforms & Ecosystems
  {
    id: "fruitful", 
    label: "🍃 Fruitful",
    url: heroSectionUrls.fruitful,
    type: "secondary",
    description: "Visit Fruitful Platform"
  },
  {
    id: "baobab",
    label: "🌳 Baobab",
    url: heroSectionUrls.baobab,
    type: "secondary", 
    description: "Access Baobab System"
  },
  {
    id: "crateDance",
    label: "🎵 Crate Dance",
    url: heroSectionUrls.crateDance,
    type: "secondary",
    description: "Fruitful Crate Dance Platform"
  },
  {
    id: "ecosystemDashboard",
    label: "🌱 Ecosystem Dashboard", 
    url: heroSectionUrls.ecosystemDashboard,
    type: "secondary",
    description: "Seedwave Ecosystem Overview"
  },
  {
    id: "seedwave",
    label: "🌱 Seedwave™",
    url: heroSectionUrls.seedwave,
    type: "secondary",
    description: "Seedwave Global Platform"
  },
  {
    id: "banimal",
    label: "🦊 Banimal™",
    url: heroSectionUrls.banimal,
    type: "secondary",
    description: "CLM Hosting - Designer Platform for App Development"
  }
];

// Terminal Access Buttons
export const terminalButtons = [
  {
    id: "vaultMaster",
    label: "🦍 VaultMaster Terminal",
    file: terminalUrls.vaultMaster,
    description: "Main VaultMaster Terminal Access"
  },
  {
    id: "cubeLattice",
    label: "🧱 Cube Lattice GPT",
    file: terminalUrls.cubeLattice,
    description: "Cube Lattice AI Terminal"
  },
  {
    id: "globalView",
    label: "🌍 Global View GPT", 
    file: terminalUrls.globalView,
    description: "Global View AI Terminal"
  },
  {
    id: "freightOps",
    label: "🚚 Freight Ops GPT",
    file: terminalUrls.freightOps,
    description: "Freight Operations AI Terminal"
  },
  {
    id: "loopWatch",
    label: "♻️ Loop Watch GPT",
    file: terminalUrls.loopWatch,
    description: "Loop Watch AI Terminal"
  },
  {
    id: "seedwaveTerminal",
    label: "🌱 Seedwave GPT",
    file: terminalUrls.seedwaveTerminal,
    description: "Seedwave AI Terminal"
  },
  {
    id: "distribution", 
    label: "📦 Distribution GPT",
    file: terminalUrls.distribution,
    description: "Distribution AI Terminal"
  },
  {
    id: "signal",
    label: "🔐 Signal GPT",
    file: terminalUrls.signal,
    description: "Signal Security Terminal"
  },
  {
    id: "faaBrands",
    label: "📦 7038 FAA Brands",
    file: terminalUrls.faaBrands,
    description: "FAA Brands Management Terminal"
  }
];

// Navigation Menu Structure
export const navigationMenu = [
  { label: "Home", url: vipNavigationUrls.home, external: true },
  { label: "Features", url: vipNavigationUrls.features, external: false },
  { label: "Signal", url: vipNavigationUrls.signal, external: false },
  { label: "Vault", url: vipNavigationUrls.vault, external: false },
  { label: "Treaty", url: vipNavigationUrls.treaty, external: false },
  { label: "VaultMesh", url: vipNavigationUrls.vaultmesh, external: false },
  { label: "About", url: vipNavigationUrls.about, external: false },
  { label: "Careers", url: vipNavigationUrls.careers, external: true },
  { label: "SecureSign", url: vipNavigationUrls.securesign, external: true },
  { label: "Contact Us", url: vipNavigationUrls.contactUs, external: true }
];

export default {
  vipNavigationUrls,
  heroSectionUrls,
  terminalUrls,
  sectorUrls,
  adminPanelUrls,
  externalUrls,
  vipButtons,
  terminalButtons,
  navigationMenu
};