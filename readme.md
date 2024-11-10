# Projet 5MOBD - Application Mobile de Partage d'Adresses

## Table des Matières
1. [Auteurs](#auteurs)
2. [Présentation](#présentation)
3. [Fonctionnalités](#fonctionnalités)
4. [Installation](#installation)
5. [Technologies Utilisées](#technologies-utilisées)
6. [Prérequis](#prérequis)
6. [Firebase](#firebase)

## Auteurs
Julien Boisgard  
Alexis Gangneux

## Présentation
5MOBD est une application mobile développée avec React Native et Expo qui permet aux utilisateurs de partager et gérer des adresses. Les utilisateurs peuvent créer un compte, ajouter des adresses publiques ou privées, commenter les adresses partagées et visualiser les emplacements sur une carte.

## Fonctionnalités
- Authentification utilisateur
- Gestion de profil avec photo
- Ajout/suppression d'adresses
- Partage public/privé d'adresses
- Système de commentaires
- Visualisation sur carte
- Upload de photos

## Installation
1. **Cloner le repository :**
    ```bash
    git clone https://github.com/GangneuxA/5MOBD 
    cd 5MOBD
    ```
2. **Installer les dépendances :**
    ```bash
    npm install
    ```
3. **Configurer Firebase :**
    - Créer un projet Firebase
    - Copier vos identifiants Firebase dans `firebaseConfig.js` dans la variable `firebaseConfig`
4. **Configurer l'API Google Maps :**
    - Obtenir une clé API Google Maps
    - L'ajouter dans `app.json` dans les variables `ios.config.googleMapsApiKey` et `android.config.googleMaps.apiKey`
5. **Lancer l'application :**
    ```bash
    npx expo start
    ```

## Technologies Utilisées
- React Native
- Expo
- Firebase
- Google Maps API
- React Navigation
- Expo Image Picker
- Async Storage

## Prérequis
- Node.js 20.18
- npm ou yarn
- Expo CLI
- Un compte Firebase
- Une clé API Google Maps : https://docs.expo.dev/versions/latest/sdk/map-view/ 


## Firebase
- Activer authentifition
- Activer firestorage
- Activer firestore database

