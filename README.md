# 🚀 Netplan Generator

Netplan Generator est un outil web moderne, rapide et responsive qui permet aux administrateurs systèmes et cloud engineers de **générer des fichiers de configuration Netplan** propres et valides.

> 🛠️ Plus besoin d'écrire du YAML à la main : sélectionne les options réseau et copie la configuration en un clic.

---

## ✨ Fonctionnalités

- Choix du **renderer** (`NetworkManager` ou `networkd`)
- Choix de l’**interface réseau** (prédéfinie ou personnalisée)
- Support du **DHCP ou IP statique**
- Configuration :
  - Adresse IP (CIDR)
  - Passerelle (via)
  - DNS multiples
  - Domaine de recherche DNS (optionnel)
- ✅ Génération automatique du fichier YAML
- 📋 Bouton pour copier la configuration dans le presse-papiers
- 💻 Design moderne (Dark mode, animations, responsive)

---

## 📁 Structure du projet

netplan-generator/
├── index.html # Page principale
├── style.css # Feuille de style personnalisée
├── script.js # Logique JavaScript
└── README.md # Documentation du projet

---
## 🚀 Déploiement local

1. Clone le dépôt ou télécharge le ZIP :

```bash
git clone https://github.com/votreutilisateur/netplan-generator.git