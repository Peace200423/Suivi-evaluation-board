# Carnet Suivi & Évaluation — KRÉA.AI

Application multi-associations (SaaS) : objectifs, indicateurs, graphiques d'évolution,
export Excel/PDF brandé, notifications email, partage WhatsApp, et abonnement Stripe (plan Pro).

## 1. Prérequis
- Un compte Vercel (tu l'as déjà ✅)
- Un compte Stripe (mode test pour commencer)
- Un compte Resend (gratuit, pour les emails) — optionnel au démarrage
- Node.js 18+ en local si tu veux tester avant de déployer

## 2. Base de données — Vercel Postgres (recommandé)
C'est le choix le plus simple car tout se configure depuis le même dashboard que ton déploiement,
sans compte tiers à créer :

1. Dans ton projet Vercel → onglet **Storage** → **Create Database** → choisis **Postgres**.
2. Vercel crée la base et **ajoute automatiquement** les variables d'environnement
   `POSTGRES_PRISMA_URL` et `POSTGRES_URL_NON_POOLING` à ton projet.
3. Aucune autre configuration nécessaire — le fichier `prisma/schema.prisma` est déjà pointé dessus.

(Alternative : Neon.tech, gratuit aussi, si tu préfères une base indépendante de Vercel —
même variables d'environnement à renseigner manuellement.)

## 3. Installer et pousser le schéma de base de données
En local, avec les variables d'environnement de production dans un fichier `.env` :

```bash
npm install
npx prisma db push
```

Cela crée les tables (`Organization`, `Objectif`, `Indicateur`, `ValeurRelevee`) dans ta base.

## 4. Stripe — abonnement Pro
1. Crée un produit "Plan Pro" dans le Dashboard Stripe (mode test d'abord), avec un prix récurrent
   mensuel (ex. 9000 FCFA / mois).
2. Copie l'ID du prix (`price_...`) → variable `STRIPE_PRICE_ID_PRO`.
3. Copie ta clé secrète (`sk_test_...` ou `sk_live_...`) → `STRIPE_SECRET_KEY`.
4. Crée un webhook Stripe pointant vers `https://ton-domaine.vercel.app/api/stripe/webhook`,
   abonné aux événements `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`. Copie le secret de signature → `STRIPE_WEBHOOK_SECRET`.

## 5. Resend — notifications email (optionnel)
1. Crée un compte sur resend.com (gratuit jusqu'à un certain volume).
2. Récupère ta clé API → `RESEND_API_KEY`.
3. Sans cette clé, l'application fonctionne normalement : les notifications sont simplement désactivées.

## 6. Déploiement sur Vercel
1. Pousse ce projet sur un repo GitHub.
2. Dans Vercel → **Add New Project** → importe le repo.
3. Ajoute toutes les variables du fichier `.env.example` dans **Settings → Environment Variables**
   (la base de données est déjà remplie automatiquement si tu as suivi l'étape 2).
4. Déploie. Vercel exécute automatiquement `prisma generate` avant le build (`postinstall`).
5. Une fois en ligne, exécute `npx prisma db push` une fois avec les vraies variables
   de production si ce n'est pas déjà fait (étape 3).

## 7. Ce qui est déjà fonctionnel
- Page d'accueil marketing (`/`) avec présentation, fonctionnalités, tarifs
- Création / connexion à un espace association (`/join`) — nom + code d'accès, isolé par structure
- Tableau de bord (`/dashboard`) : objectifs, indicateurs, jauges de progression, graphiques d'évolution
- Export Excel et PDF brandés KRÉA.AI
- Partage WhatsApp de l'avancement
- Notifications email automatiques à chaque mise à jour d'indicateur (si Resend configuré)
- Paiement Stripe pour passer du plan Gratuit (2 objectifs / 6 indicateurs) au plan Pro (illimité)

## 8. Limites connues à améliorer avant un vrai lancement public
- Le code d'accès protège l'espace mais il n'y a pas de gestion fine des rôles (tout membre
  ayant le code a un accès complet en lecture/écriture).
- Pas de récupération de code oublié (à prévoir : envoi par email via Resend).
- Le plan Pro est unique ; pas encore de page de facturation / historique des paiements
  (Stripe Customer Portal serait la prochaine étape naturelle).
- Pas de tests automatisés ni de CI configurés.

## 9. Pour aller plus loin
- Ajouter le **Stripe Customer Portal** pour que les associations gèrent leur abonnement seules.
- Ajouter des rôles (administrateur / contributeur) par organisation.
- Ajouter un sous-domaine ou domaine personnalisé par association (multi-tenant avancé).
