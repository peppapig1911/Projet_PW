# Projet Application Web Full Stack

Ce projet consiste à développer une application web full stack.

---

## Front-end
* **React**
* **React Router**

## Back-end
* **Node.js Express**
* **API REST**
* **Authentification JWT**

---

## Configuration

1. **Git clone** the repository

2. **Make sure you have all the dependencies installed :**

   * **2.1.1.** In folder `event-backend` : type the command `npm install`
   * **2.1.2.** In the same folder do `npm install express cors bcryptjs jsonwebtoken`

   * **2.2.1.** Once dependencies installed in `event-backend`, do `cd ..` in the terminal
   * **2.2.3.** In `event-frontend` folder, do `npm install`

   * **2.3.1.** Connect to postgres by typing `psql -U postgres`
   * **2.3.2.** Create database with `CREATE DATABASE database_web;`
   * **2.3.3.** Connect to the database by typing : `\c database_web`
   * **2.3.4.** Copy-Paste all the tables written in the `tables.txt` file to create the tables

3. **Modify Front-End Port** if needed (default : 5173) in :  
   `event-backend/src/server.js` (l.15)

4. **Modify postgres password** in :  
   `event-backend/db.js` (l.7)

5. **Save file**

---

## How to

1. Open Terminal in `event-frontend` and run command `npm run dev`
2. Open Terminal in `event-backend` and run command `node .\src\server.js`
3. Open another terminal and connect to the database if not connected :
   * Type `psql -U postgres` and enter your password
   * Connect to the database by typing : `\c database_web`
4. Open link and modify port if needed: [http://localhost:5173/](http://localhost:5173/)
5. **Sign up ! :)**

---

## Détails du Projet

### Choix Techniques

* **Sécurité & Authentification :** Implémentation de **JWT** pour une authentification qui permet de sécuriser les routes du back
* **Gestion du State :** Utilisation des **Hooks React** (`useState`, `useEffect`) pour gérer la synchronisation en temps réel entre la homePage, la detailPage et le ProfilePage

### Axes d’Amélioration

* Ajouter des notifications pour confirmer le succès des inscriptions/suppressions.
* Implémenter une barre de recherche et des filtres par catégorie ou par ville.
* Mettre en place la pagination 
