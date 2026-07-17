# 👋 Qui est là ? — Gestion des visiteurs

## 📌 Description du projet

**Qui est là ?** est une infrastructure web permettant de gérer les entrées et sorties des visiteurs d'une entreprise.

L'objectif est de savoir en temps réel :

- Qui est présent dans le bâtiment
- Qui est entré
- Qui est sorti
- Quel est le motif de sa visite
- Qui il vient rencontrer ou quelle formation il suit

Le projet est composé de deux interfaces :

1. Une application tablette disponible à l'accueil pour enregistrer les visiteurs.
2. Un tableau de bord permettant de consulter les visiteurs présents et l'historique.

---

# 🚀 Fonctionnalités

## 📱 Application accueil (Tablette)

### Entrée visiteur

Un visiteur peut enregistrer son arrivée avec :

- Nom
- Prénom
- Email
- Motif de visite

Deux types de visites sont disponibles :

### 👤 Visite

Le visiteur sélectionne :

- La personne visitée
- Les informations du contact

### 🎓 Formation

Le visiteur sélectionne :

- La formation prévue

Après validation :

- Création automatique du visiteur dans WordPress
- Génération d'un badge
- Génération d'un QR Code unique

---

## 🚪 Sortie visiteur

La sortie peut être réalisée :

- Par saisie d'un identifiant visiteur
- Par scan QR Code (version actuelle)

Lors de la sortie :

- La date de sortie est enregistrée
- Le visiteur disparaît des visiteurs présents
- Il apparaît dans l'historique

---

# 🛡️ Gestion des doublons

Le système empêche les doubles enregistrements.

Une personne est considérée comme déjà présente si :
