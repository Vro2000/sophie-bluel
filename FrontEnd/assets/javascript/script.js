// URLs de l'API pour accéder aux données des travaux et des catégories.
const urlWorks = 'http://localhost:5678/api/works';
const urlCategories = 'http://localhost:5678/api/categories';

// Fonction principale qui se charge à l'ouverture de la page.
function loadPageFonct() {
    // Lancement simultané de requêtes fetch pour récupérer les travaux et les catégories.
    Promise.all([
        fetch(urlWorks).then(response => response.json()),  // Récupère les travaux et les convertit en JSON.
        fetch(urlCategories).then(response => response.json())  // Récupère les catégories et les convertit en JSON.
    ])
    .then(ResponsesTab => {  // Manipulation des réponses une fois toutes reçues.
        const projetsTab = ResponsesTab[0];  // Tableau contenant les projets.
        const categoriesTab = ResponsesTab[1];  // Tableau contenant les catégories.
        const isAdmin = Boolean(localStorage.getItem("token"));  // Vérifie si un token est stocké, signifiant que l'utilisateur est admin.
        updatePageContent(isAdmin, projetsTab, categoriesTab);  // Appelle la fonction pour mettre à jour le contenu de la page.
    });
}

// Fonction pour mettre à jour le contenu de la page en fonction des données reçues et du statut d'utilisateur.
function updatePageContent(isAdmin, projetsTab, categoriesTab) {
    const menuCategories = document.getElementById('menu-categories');  // Récupère l'élément HTML pour les catégories.

    // Affichage conditionnel basé sur le statut administrateur.
    if (isAdmin) {
        selectProjetsFonct(0, projetsTab, categoriesTab);  // Affiche tous les projets pour l'admin.
        menuCategories.style.display = 'none';  // Cache le menu des catégories pour l'admin.
    } else {
        menuCategories.style.display = 'flex';  // Affiche le menu des catégories pour un utilisateur non admin.
        const setCategoriesTab = new Set();  // Utilise un Set pour filtrer et ne garder que les catégories uniques.
        const uniqueCategoriesTab = categoriesTab.filter(categorie => {
            const isDuplicate = setCategoriesTab.has(categorie.name);  // Vérifie si la catégorie est déjà ajoutée au Set.
            setCategoriesTab.add(categorie.name);  // Ajoute la catégorie au Set.
            return !isDuplicate;  // Garde seulement les éléments non dupliqués.
        });

        // Efface le contenu précédent des catégories.
        menuCategories.innerHTML = '';
        const allCategoriesTab = [{ id: 0, name: 'Tous' }, ...uniqueCategoriesTab];  // Ajoute une option "Tous" aux catégories uniques.
        
        // Crée des boutons pour chaque catégorie.
        allCategoriesTab.forEach(allCategorie => {
            const buttonHtml = document.createElement('button');  // Crée un bouton.
            buttonHtml.textContent = allCategorie.name;  // Définit le texte du bouton avec le nom de la catégorie.
            menuCategories.appendChild(buttonHtml);  // Ajoute le bouton au menu des catégories.

            // Met le bouton "Tous" en actif par défaut.
            if (allCategorie.name === 'Tous') {
                buttonHtml.classList.add('active');
            }

            // Ajoute un écouteur d'événements sur le clic pour chaque bouton.
            buttonHtml.addEventListener('click', () => {
                document.querySelectorAll('.menu-categories button').forEach(btn => {
                    btn.classList.remove('active');  // Enlève la classe 'active' de tous les boutons.
                });
                buttonHtml.classList.add('active');  // Ajoute la classe 'active' au bouton cliqué.
                selectProjetsFonct(allCategorie.id, projetsTab, categoriesTab);  // Filtre les projets selon la catégorie sélectionnée.
            });
        });

        selectProjetsFonct(0, projetsTab, categoriesTab);  // Affiche tous les projets initialement.
    }

    logInOutBtnFonct(isAdmin);  // Configure le bouton de connexion/déconnexion.
}

// Configure le bouton de connexion/déconnexion en fonction du statut d'administrateur.
function logInOutBtnFonct(isAdmin) {
    const logInOut = document.getElementById("log-in-out");  // Récupère le bouton de connexion/déconnexion.
    const modeEdition = document.getElementById("mode-edition");  // Récupère l'élément de mode édition.
    const modifyLabel = document.querySelector("label[for='modify-btn']");  // Récupère le label du bouton de modification.

    // Configuration des éléments en fonction si l'utilisateur est administrateur ou non.
    if (isAdmin) {
        logInOut.textContent = "logout";  // Change le texte en "logout".
        logInOut.href = "#";  // Définit le lien hypertexte vers aucun (page courante).
        modeEdition.classList.remove("hidden");  // Affiche les éléments du mode édition.
        modifyLabel.classList.remove("hidden");  // Affiche le label du bouton de modification.

        logInOut.addEventListener('click', () => {
            localStorage.removeItem("token");  // Supprime le token du stockage local.
            window.location.href = "assets/html/login.html";  // Redirige l'utilisateur vers la page de connexion.
        });
    } else {
        logInOut.textContent = "login";  // Change le texte en "login".
        logInOut.href = "assets/html/login.html";  // Définit le lien vers la page de connexion.
        modeEdition.classList.add("hidden");  // Cache les éléments du mode édition.
        modifyLabel.classList.add("hidden");  // Cache le label du bouton de modification.

        logInOut.onclick = null;  // Enlève tout gestionnaire d'événements précédemment attaché.
    }
}

// Fonction pour sélectionner et afficher les projets selon la catégorie choisie.
function selectProjetsFonct(selectCategoryId, projetsTab, categoriesTab) {
    const galleryHtml = document.querySelector('.gallery');  // Récupère l'élément de la galerie.
    galleryHtml.innerHTML = '';  // Vide la galerie avant d'ajouter de nouveaux contenus.

    // Détermine les projets à afficher basé sur l'ID de catégorie.
    let selectProjetsTab;
    if (selectCategoryId === 0) {  // Si "Tous" est sélectionné.
        selectProjetsTab = projetsTab;  // Utilise le tableau complet des projets.
    } else {
        selectProjetsTab = projetsTab.filter(projet => projet.categoryId === selectCategoryId);  // Filtre les projets par catégorie.
    }

    // Crée et ajoute les éléments pour chaque projet dans la galerie.
    selectProjetsTab.forEach(selectProjet => {
        const figureHtml = document.createElement('figure');  // Crée un élément figure.
        const imgHtml = document.createElement('img');  // Crée un élément image.
        imgHtml.src = selectProjet.imageUrl;  // Définit l'URL de l'image.
        imgHtml.alt = selectProjet.title;  // Définit le texte alternatif avec le titre du projet.

        const figcaptionHtml = document.createElement('figcaption');  // Crée un élément figcaption.
        const foundCategory = categoriesTab.find(categorie => categorie.id === selectProjet.categoryId);  // Trouve la catégorie correspondante.
        const title = selectProjet.title;  // Stocke le titre du projet.
        const categoryName = foundCategory ? foundCategory.name : "Unknown";  // Définit le nom de la catégorie ou "Unknown" si non trouvé.
        figcaptionHtml.textContent = `${title} - ${categoryName}`;  // Définit le texte de la légende.

        figureHtml.appendChild(imgHtml);  // Ajoute l'image à la figure.
        figureHtml.appendChild(figcaptionHtml);  // Ajoute la légende à la figure.
        galleryHtml.appendChild(figureHtml);  // Ajoute la figure à la galerie.
    });
}

// Ajout d'un écouteur d'événements pour charger la fonction `loadPageFonct` lorsque le DOM est entièrement chargé.
window.addEventListener("DOMContentLoaded", loadPageFonct);
