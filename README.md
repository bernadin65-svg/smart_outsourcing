#  — site web externalisation (BPO)




##  Table des matières

- [À propos du projet](#-à-propos-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Lancement](#-lancement)
- [Structure du projet](#-structure-du-projet)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- 

---

##  À propos du projet

**Externalisation Intelligente est une plateforme web dédiée au Business Process Outsourcing (BPO)**. Elle permet aux entreprises de gérer, automatiser et externaliser efficacement leurs processus métier non-essentiels tout en gardant une visibilité totale sur les opérations.

### Objectifs principaux

- **Réduire les coûts opérationnels** en externalisant les tâches répétitives
- **Améliorer la productivité** grâce à un tableau de bord centralisé
- **Faciliter la communication** entre donneurs d'ordre et prestataires BPO
- **Assurer la traçabilité** de chaque processus externalisé

---

##  Fonctionnalités

-  **Gestion des utilisateurs** — Rôles distincts : clients, agents, administrateurs
- **Gestion des processus** — Création, suivi et clôture des missions BPO
- **Notifications par email** — Alertes automatiques via Gmail SMTP
- **Rapports & Statistiques** — Suivi des performances et des délais
- **Authentification sécurisée** — Gestion des sessions et des accès
- **Interface responsive** — Compatible desktop, tablette et mobile

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│              Frontend (React + Vite)          │
│  ┌─────────────┐  ┌──────────────────────┐   │
│  │  Composants │  │   Pages / Routing    │   │
│  └─────────────┘  └──────────────────────┘   │
└─────────────────────────┬────────────────────┘
                          │ API REST
┌─────────────────────────▼────────────────────┐
│              Backend (Node.js / Express)      │
│  ┌─────────────┐  ┌──────────────────────┐   │
│  │ Contrôleurs │  │   Services / Modèles │   │
│  └─────────────┘  └──────────────────────┘   │
│  ┌─────────────────────────────────────────┐  │
│  │        Gmail SMTP (Nodemailer)          │  │
│  └─────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

##  Prérequis

Avant de commencer, assurez-vous d'avoir installé :

| Outil | Version minimale |
|-------|-----------------|
| [Node.js](https://nodejs.org/) | ≥ 18.x |
| [npm](https://www.npmjs.com/) | ≥ 9.x |
| Compte Gmail | Pour les notifications SMTP |

---

##  Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/bernadin65-svg/externalisation-intelligente.git
cd externalisation-intelligente
```

### 2. Installer les dépendances

```bash
# Dépendances frontend
npm install

# Dépendances backend (depuis le dossier source)
cd src
npm install
```

---

## ⚙️Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example` :

```env
# Application
VITE_APP_NAME=Externalisation Intelligente
VITE_API_URL=http://localhost:3000

# Email (Gmail SMTP)
GMAIL_USER=votre-email@gmail.com
GMAIL_APP_PASS=votre-mot-de-passe-application

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bpo_db
DB_USER=postgres
DB_PASS=votre-mot-de-passe
```


---

##  Lancement

### Mode développement

```bash
# Frontend (Vite avec HMR)
npm run dev
```

L'application sera accessible sur : **http://localhost:5173**

### Mode production

```bash
# Construire l'application
npm run build

# Prévisualiser le build
npm run preview
```

### Linting

```bash
npm run lint
```

---

##  Structure du projet

```
externalisation-intelligente/
├── public/                  # Fichiers statiques
├── src/                     # Code source principal
│   ├── assets/              # Images, icônes, polices
│   ├── components/          # Composants React réutilisables
│   ├── pages/               # Pages de l'application
│   ├── services/            # Appels API et logique métier
│   ├── hooks/               # Hooks React personnalisés
│   ├── context/             # Contextes React (Auth, Thème…)
│   └── utils/               # Fonctions utilitaires
├── .env                     # Variables d'environnement (local)
├── .gitignore               # Fichiers ignorés par Git
├── eslint.config.js         # Configuration ESLint
├── index.html               # Point d'entrée HTML
├── package.json             # Dépendances et scripts npm
├── vite.config.js           # Configuration Vite
└── README.md                # Ce fichier
```

---

##  Déploiement

Le projet est déployé en continu via **GitHub Actions** vers l'environnement de production.

| Environnement | URL | Statut |
|--------------|-----|--------|
| Production | [externalisation-bpo](https://github.com/bernadin65-svg/externalisation-intelligente/deployments) | ✅ Actif |

### Déployer manuellement

```bash
npm run build
# Puis déployer le dossier dist/ sur votre hébergeur (Vercel, Netlify, VPS...)
```

---

##  Contribution

Les contributions sont les bienvenues ! Voici comment procéder :

1. **Forkez** le dépôt
2. Créez une branche pour votre fonctionnalité : `git checkout -b feature/ma-fonctionnalite`
3. Commitez vos changements : `git commit -m "feat: ajout de ma fonctionnalité"`
4. Poussez votre branche : `git push origin feature/ma-fonctionnalite`
5. Ouvrez une **Pull Request**

### Convention de commits

| Préfixe | Usage |
|---------|-------|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `docs:` | Documentation |
| `refactor:` | Refactorisation du code |
| `style:` | Formatage, style |
| `test:` | Ajout ou modification de tests |

---

##  Auteur

**Bernadin IASY**  
[@bernadin65-svg](https://github.com/bernadin65-svg)






