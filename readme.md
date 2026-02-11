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


2. **In Terminal 1 :**

   * cd `event-backend` : 
       *     type the command `npm install`
       *     run command `node .\src\server.js`

3. **In Terminal 2 :**

   * cd `event-frontend` :
      *     type the command `npm install`
      *     run command `npm run dev`


3. **In Terminal 3 :**

   * Connect to postgres by typing `psql -U postgres` and enter password
   * Create database with `CREATE DATABASE database_web;`
   * Connect to the database by typing : `\c database_web`
   * Copy-Paste all the tables written in the `tables.txt` file to create the tables

* Create Data Source -> PostgreSQL
* On database_web choose "public schemas"
* In *serve.js* : modify postgres password and save file

---

## Frontend

4. Open link and modify port if needed: [http://localhost:5173/](http://localhost:5173/)
5. **Sign up ! :)**
6. Once signed up, log in 

(Pour ajouter une image d'internet à un évènement il faudra choisir une image, l'ouvrir dans un nouvel onglet et copier l'url )

---

## Détails du Projet

### Choix Techniques

* Implémentation de **JWT** pour une authentification qui permet de sécuriser les routes du back
* Utilisation des `useState`, `useEffect` pour gérer la synchronisation en temps réel entre la homePage, la detailPage et le ProfilePage

### Axes d’Amélioration

* Ajouter des notifications pour confirmer le succès des inscriptions/suppressions.
* Implémenter une barre de recherche et des filtres par catégorie ou par ville.
* Mettre en place la pagination 


### Utilisation de l'IA 

* Pour implémenter le premier form inscription
* Pour implémenter la logique de compteur et inscription à un évènement
* Pour afficher les events auxquels nous sommes inscrits
