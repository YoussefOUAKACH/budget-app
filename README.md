# Application de Gestion de Budget

Une application moderne et intuitive pour gérer vos finances personnelles, développée avec React, TypeScript, Tailwind CSS et Capacitor.

## 🚀 Fonctionnalités

- **Tableau de bord interactif** : Suivi en temps réel du solde, des revenus et des dépenses.
- **Gestion des transactions** : Ajout et suppression de revenus et dépenses avec catégories.
- **Visualisation de données** : Graphiques circulaires et en barres pour analyser vos dépenses (via Recharts).
- **Design Responsive** : Interface optimisée pour PC et prête pour mobile (iOS/Android).
- **Icônes élégantes** : Utilisation de Lucide React.

## 🛠️ Technologies utilisées

- **Frontend** : React 19, TypeScript, Vite
- **Styling** : Tailwind CSS v4
- **Graphiques** : Recharts
- **Mobile** : Capacitor (iOS configuré)
- **Icônes** : Lucide React

## 📦 Installation et Lancement

### Version Web (PC)

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/YoussefOUAKACH/budget-app.git
   cd budget-app
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

### Version Mobile (iOS)

*Note : Nécessite un Mac avec Xcode pour la compilation finale.*

1. Construisez le projet web :
   ```bash
   npm run build
   ```

2. Synchronisez avec Capacitor :
   ```bash
   npx cap sync ios
   ```

3. Ouvrez dans Xcode :
   ```bash
   npx cap open ios
   ```

## 📄 Licence

Ce projet est sous licence MIT.
