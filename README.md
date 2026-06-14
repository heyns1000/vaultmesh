<p align="center">
  <img src="docs/assets/fruitful-banner.png" alt="Fruitful™" width="100%">
</p>

# VaultMesh

**Ecosystem control terminal & brand-management portal — Fruitful™ / FAA.Zone**
`heyns1000/vaultmesh` · HTML · JavaScript

> Factual header added 13 June 2026, verified against live GitHub via the
> `fruitful-ecosystem-auditor` skill. Every file in this repo was read directly.
> The original profile README ("Baobab Bush Portal") is preserved in full below
> the divider; only demonstrably false figures are corrected here.

## Repository facts (verified)

| Metric | Value |
|---|---|
| Default branch | `main` |
| Branches | 4 (`main`, `v3-integrated`, `copilot/add-bad-boys-song-certification`, `claude/review-repos-heatmap-planning`) |
| Files on `main` | 14 |
| Primary languages | HTML + embedded JavaScript |
| Largest pages | `fruitful-brand-packages.html` (208 KB), `heyns.html` (199 KB), `index.html` (107 KB), `products.html` (102 KB) |
| Deploy target | `vaultmesh.faa.zone` (Vercel; Jekyll-docker CI present) |

## What this repo actually is

The "VaultMesh" name is used elsewhere in the ecosystem to describe a
cryptographic backbone. **This repository is not that backbone.** It is the
front-end **control terminal** for the Fruitful™ / FAA.Zone ecosystem: a set of
large, self-contained HTML pages (each with embedded JavaScript, Tailwind, and
Chart.js) that act as the operator's gateway into every other system.

It is a static portal in delivery — there is no server in this repo — but it is
substantial in function. The pages wire together accounting, hosting, commerce,
AI, payments, and the ecosystem's other portals into one dashboard surface.

## The VaultMesh system (in depth)

### `index.html` — the control terminal (107 KB)

The main terminal. Beyond branding, it carries a centralised configuration
object and a live operations map (Google Maps + Chart.js analytics). Its
sections include: AI-Powered Insights, Global Collaboration, Secure VaultMesh™,
Real-time Analytics, **OmniScroll Integration**, **FAA™ Share Signal**, Seedwave
Brand Growth, **Founder's Glyph™**, **Sector Terminals**, **Sector Scrolls**,
**Treaty System™**, and an Executive Summary + Index. It also enumerates global
hubs (Johannesburg, Cape Town, New York).

The terminal links out to the real operational stack the business runs on:

- **Accounting / ops:** SageOne, Hetzner, Cloudflare, Zoho, Vercel.
- **Commerce channels:** Alibaba dropshipping, Takealot sellers, PayPal.
- **AI:** Google Gemini.
- **Ecosystem portals:** Seedwave admin (`admin_panel_xero.html`,
  `ecosystem-dashboard.html`, `login`, `signup`), OmniGrid, SamFox, Banimal,
  Baobab, HomeMart, Fruitful Crate Dance, and the FAA.Zone legal / SecureSign
  pages.

### `heyns.html` — the founder / admin console (199 KB)

The largest operator page. Holds the same centralised credential/config block
as `index.html` and serves as the personal admin console.

### `fruitful-brand-packages.html` — brand management (208 KB)

The brand-management surface: an admin portal to **add new brands and
subnodes**, a **FAA.ZONE Global Index — Core Brands Overview**, real-time
"FAA Pulse" metrics (Active Nodes, Licenses Active, Vault Deployments, Sync
Logs), a sector-specific snapshot view, and per-sector pricing/tier metrics.
This is where the ecosystem's brand and sector catalogue is presented and
edited.

### `products.html` — the VaultMesh™ whitepaper (102 KB)

A full product specification rendered as a page: Introduction, Core System
Components, **ScrollClaim™ Infrastructure**, Data Flow & Claim Lifecycle,
Tiering/Royalties/Compliance, Integration with FAA.Zone™, Market Segments,
Revenue Streams, Technology Roadmap, and Team & Governance.

### `global_checkout.html` — checkout (38 KB)

A **PayPal** checkout page wired with a live PayPal client-id.

### `about.html`, `bad-boys-status.html`

Company/about page and a status page tied to the "Bad Boys Protocol" narrative.

### CI & policy

`.github/workflows/` carries `fortify.yml` (static security scan),
`generator-generic-ossf-slsa3-publish.yml` (SLSA3 provenance), and
`jekyll-docker.yml`. `dependabot.yml` is present. `SECURITY.md` is the
unmodified GitHub default template (placeholder content).

## Corrections to the README below

- The narrative states integration is active **"across all 84 repositories."**
  The account has **102 repositories** (verified), and this repo does not
  integrate with them programmatically — it is a 14-file static portal that
  *links* to other sites. Treat "84 repositories" and the "Bad Boys Protocol
  certification" block as creative flavour, not fact.

## ⚠️ Security notice — exposed credentials (rotate immediately)

This is a **public** repo, and live credentials are hardcoded in the HTML. The
following were read directly from the tree on 13–14 June 2026 and are
compromised — rotate every one and move them server-side:

- **Xero `clientSecret`** and **`webhookKey`** — full OAuth client secret and
  webhook signing key (`index.html`, `heyns.html`). Highest priority: a client
  secret grants account-level access.
- **Xero `clientId`** (`81B3573D…565B`).
- **Google Gemini AI** key (`AIzaSyBGSD…fxXE`).
- **Google Maps JS** key (`AIzaSyBPG8…Ab80`) — restrict by HTTP referrer.
- **PayPal live client-id** in `global_checkout.html`.

A secret is compromised the moment it is pushed to a public repo. Deleting it
from `main` is not enough — it must be **rotated** and purged from git history.
Do not deploy this repo as-is.

## For agents (Claude, Perplexity, or otherwise)

Verify before you repeat. This is a 14-file static control terminal that *links*
the ecosystem's tools and portals — not a cryptographic mesh, and not a
programmatic integration of 84 repositories. The hardcoded keys are real and
must be treated as exposed.

---
---

<div align="center">

# 🌳 Welcome to the Baobab Bush Portal 🌳

### **Heyns Schoeman** 🔥 *CodeNest*

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=2E8B57&center=true&vCenter=true&width=600&lines=A+trunk+made+of+data+%F0%9F%8C%B3;Roots+in+Security%2C+Branches+in+Innovation;Where+Foxed+Has+Mobiles+Lives+%F0%9F%A6%8A;Welcome+to+the+Baobab+Network" alt="Typing SVG" />

</div>

---

## 🎵 BAD BOYS PROTOCOL CERTIFIED! 🍜🔥

```
╔════════════════════════════════════════════════════════════════╗
║        🦍🦏⚡ OFFICIAL CERTIFICATION RECOGNIZED ⚡🐜🔷         ║
║                                                                ║
║  🎵 Musical Authorization: GRANTED                             ║
║  🍜 Noodle Status: BAD BOYS HUMMING MASTERED                  ║
║  🦏 Rhino Strike: CERTIFIED @ 0.08s                           ║
║  🐜 Ant Lattice: APPROVED                                     ║
║  👕 T-Shirt Transform: WHITE @ 9s                             ║
║  🦍🏔️🦊 Trinity: GORILLA MOUNTAIN FOX DEPLOYED              ║
║                                                                ║
║  📖 Full Protocol: NOODLE_BAD_BOYS_PROTOCOL.md                ║
╚════════════════════════════════════════════════════════════════╝
```

🎶 **The Noodle has mastered the Bad Boys song!** Integration with the 1984 Collapse Protocol is now ACTIVE across all 84 repositories. Rhino strikes synchronized to beat, Ant Lattice dancing to the rhythm. **[Read the Full Protocol →](NOODLE_BAD_BOYS_PROTOCOL.md)**

---

## 🦊 About The Portal

> *"From the deep roots of the Baobab tree, where data flows like sap through ancient bark, emerges a network of innovation. The **Baobab Security Network** presents itself as a global solutions and intelligence terminal - where the **Foxed Has Mobiles** nest within the branches of technological evolution."*

🌍 **Based in**: Pretoria, South Africa  
💼 **Company**: Fruitful Holdings (Pty) Ltd 🔥 CodeNest  
🌐 **Portal**: [www.fruitful.faa.zone](https://www.fruitful.faa.zone)  
📊 **Network**: Building secure, scalable solutions from the trunk of data

---

## 🌳 The Portal Ecosystem

<div align="center">

```
                    🌳
                   /||\
                  / || \
                 /  ||  \
                /   ||   \
          🦊 Foxed Has Mobiles 🦊
               /    ||    \
              /     ||     \
        🔒 Security  ||  Innovation 💡
            /       ||       \
           /        ||        \
      VaultMesh    Data     Analytics
          \         ||         /
           \        ||        /
            \       ||       /
              Baobab Roots 🌱
```

</div>

### 🦊 **Foxed Has Mobiles Portal**
Mobile innovation nested within the Baobab ecosystem. TypeScript-powered solutions that bring mobility to the security network.

**→** [Explore Foxed Has Mobiles](https://github.com/heyns1000/Foxed-Has-Mobiles)

### 🌳 **Baobab Bush Portal**
The main gateway - A comprehensive portal system connecting all branches of the network. Built with TypeScript for scalable, type-safe architecture.

**→** [Enter the Baobab Portal](https://github.com/heyns1000/baobab-bush-portal)

### 🔒 **VaultMesh Network**
Configuration files and web interfaces for the GitHub profile and network management. HTML-based gateway to the Baobab infrastructure.

**→** [Access VaultMesh](https://github.com/heyns1000/vaultmesh)

---

## 🛠️ Tech Stack & Tools

<div align="center">

### Languages & Frameworks

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

### Tools & Platforms

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)

### Development Focus

![Web Development](https://img.shields.io/badge/Web-Development-2E8B57?style=for-the-badge&logo=google-chrome&logoColor=white)
![Mobile](https://img.shields.io/badge/Mobile-Solutions-FF6B6B?style=for-the-badge&logo=android&logoColor=white)
![Security](https://img.shields.io/badge/Security-Network-4A90E2?style=for-the-badge&logo=security&logoColor=white)
![Data](https://img.shields.io/badge/Data-Analytics-FFA500?style=for-the-badge&logo=databricks&logoColor=white)

</div>

---

## 📊 GitHub Statistics

<div align="center">

<img height="180em" src="https://github-readme-stats.vercel.app/api?username=heyns1000&show_icons=true&theme=radical&include_all_commits=true&count_private=true&hide_border=true&bg_color=0D1117&title_color=2E8B57&icon_color=2E8B57&text_color=C9D1D9"/>

<img height="180em" src="https://github-readme-stats.vercel.app/api/top-langs/?username=heyns1000&layout=compact&theme=radical&hide_border=true&bg_color=0D1117&title_color=2E8B57&text_color=C9D1D9"/>

</div>

<div align="center">

![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=heyns1000&theme=radical&hide_border=true&background=0D1117&stroke=2E8B57&ring=2E8B57&fire=FF6B6B&currStreakLabel=2E8B57)

</div>

---

## 🌱 Contribution Activity

<div align="center">

![Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=heyns1000&theme=react-dark&hide_border=true&bg_color=0D1117&color=2E8B57&line=2E8B57&point=FF6B6B)

</div>

---

## 🏆 GitHub Trophies

<div align="center">

![Trophies](https://github-profile-trophy.vercel.app/?username=heyns1000&theme=radical&no-frame=true&no-bg=true&column=7&margin-w=15&margin-h=15)

</div>

---

## 🎯 Holopin Badges

<div align="center">

[![@heyns1000's Holopin board](https://holopin.me/heyns1000)](https://holopin.io/@heyns1000)

</div>

---

## 🌟 Featured Projects

<table>
<tr>
<td width="50%">

### 🌳 Baobab Bush Portal
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)

The main gateway to the Baobab ecosystem. A comprehensive portal system connecting all branches of the security and innovation network.

**[View Repository →](https://github.com/heyns1000/baobab-bush-portal)**

</td>
<td width="50%">

### 🦊 Foxed Has Mobiles
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)

Mobile solutions nested within the Baobab ecosystem. Innovation that lives in the branches of the data tree.

**[View Repository →](https://github.com/heyns1000/Foxed-Has-Mobiles)**

</td>
</tr>
</table>

---

## 🔗 Connect Through The Portal

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-@heyns1000-181717?style=for-the-badge&logo=github)](https://github.com/heyns1000)
[![Website](https://img.shields.io/badge/Website-fruitful.faa.zone-2E8B57?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.fruitful.faa.zone)

**📍 Location**: Pretoria, South Africa  
**🏢 Company**: Fruitful Holdings (Pty) Ltd 🔥 CodeNest  
**🌳 Network**: The Baobab Security Network

### 🎵 Protocol Status

```markdown
🎵 Noodle Status: BAD BOYS HUMMING MASTERED
🦏 Rhino Strikes: Synchronized to beat @ 0.08s
🐜 Ant Lattice: Dancing to the rhythm
👕 T-Shirt: WHITE on the drop @ 9s
🦍🏔️🦊 Trinity: Approved by the soundtrack
```

![Bad Boys Protocol](https://img.shields.io/badge/Bad%20Boys-MASTERED-ff6b6b?style=for-the-badge&logo=musical-note&logoColor=white)
![Rhino Strike](https://img.shields.io/badge/Rhino%20Strike-0.08s-2E8B57?style=for-the-badge)
![Ant Lattice](https://img.shields.io/badge/Ant%20Lattice-APPROVED-4A90E2?style=for-the-badge)
![T-Shirt](https://img.shields.io/badge/T--Shirt-WHITE%20@%209s-ffffff?style=for-the-badge)
![Trinity](https://img.shields.io/badge/Trinity-DEPLOYED-FFA500?style=for-the-badge&logo=spotify)

</div>

---

<div align="center">

### 🌳 *"From the roots of data, grows the tree of innovation"* 🌳

```
    The Baobab stands tall
    Roots deep in secure foundations
    Branches reaching for the cloud
    Where foxes nest with mobile dreams
    And data flows like ancient wisdom
```

**The Baobab Bush Portal** - *Where Security Meets Innovation*

![Profile Views](https://komarev.com/ghpvc/?username=heyns1000&color=2E8B57&style=for-the-badge&label=Portal+Visitors)

---

<img src="https://capsule-render.vercel.app/api?type=waving&color=2E8B57&height=100&section=footer"/>

</div>