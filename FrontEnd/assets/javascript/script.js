const isAdmin = Boolean(localStorage.getItem("token"));
let projetsTab = []; 
let categoriesTab = [];

Promise.all([
	fetch("http://localhost:5678/api/works").then((response) => response.json()),
	fetch("http://localhost:5678/api/categories").then((response) => response.json()),

]).then((ResponsesTab) => {
	projetsTab = ResponsesTab[0];
	categoriesTab = ResponsesTab[1];
	loadPageFonct();
	checkAndLoadModal(); // Vérifier et charger la modale si nécessaire
});

function loadPageFonct() {
	if (!isAdmin) { // si on n'est pas administrateur pas de token

		// création du menu

		const allCategoriesTab = [{ id: 0, name: "Tous" }, ...categoriesTab]; // Ajout d'une catégorie "Tous"

		allCategoriesTab.forEach((categorie) => { // boucle pour création des boutons
			const menuCategHtml = document.getElementById("menu-categories");
			const buttonHtml = document.createElement("button"); 
			buttonHtml.textContent = categorie.name; 
			menuCategHtml.appendChild(buttonHtml); 

			if (categorie.name === "Tous") { // "par défaut Tous" est sélectionné
				buttonHtml.classList.add("active");
				galleryProjetsFonct(0); 
			}
			
			buttonHtml.addEventListener("click", () => {
				document.querySelectorAll(".menu-categories button").forEach((btn) => {
					btn.classList.remove("active"); // remise à 0 des anciens css
				});
				buttonHtml.classList.add("active"); // le bouton cliqué prend la class active

				galleryProjetsFonct(categorie.id); // envoie la valeur id du bouton cliqué
			});
		});
	} else {
		loadPageAdmin();
	}
}

function loadPageAdmin() {
	const menuCategHtml = document.getElementById("menu-categories");
	menuCategHtml.style.display = "none"; // cache le menu
	galleryProjetsFonct(0); // affiche tous les projets

	const logInOut = document.getElementById("log-in-out");
	const modeEdition = document.getElementById("mode-edition");
	const modifyLabel = document.querySelector("label[for='modify-btn']");

	logInOut.textContent = "logout"; //change login en logout
	modeEdition.classList.remove("hidden"); // affiche bande "mode édition"
	modifyLabel.classList.remove("hidden"); // affiche bouton modifier

	logInOut.addEventListener("click", () => { // logout efface le token
		localStorage.removeItem("token");
		window.location.href = "assets/html/login.html";
	});
}

function galleryProjetsFonct(categorieId) { 
	const galleryHtml = document.querySelector(".gallery");
	galleryHtml.innerHTML = ""; // remise à 0 de la gallerie

	let selectedProjetsTab; // on enregistre les projets à afficher
	if (categorieId === 0) { 
		selectedProjetsTab = projetsTab; //Tous les projets
	} else {
		selectedProjetsTab = projetsTab.filter((item) => item.categoryId === categorieId );
		// méthode filter() : uniquement ceux qui ont la bonne categorieId
	}
	
	selectedProjetsTab.forEach((selectedProjet) => { // générer les éléments html :
		const figureHtml = document.createElement("figure"); // le container

		const imgHtml = document.createElement("img"); // l'image
		imgHtml.src = selectedProjet.imageUrl;
		imgHtml.alt = selectedProjet.title;

		const figcaptionHtml = document.createElement("figcaption"); // le commentaire
		const title = selectedProjet.title;

		// fonction find cherche la même id que le selectedProjet
		const foundCategoryTab = categoriesTab.find((item) => item.id === selectedProjet.categoryId);
		const categoryName = foundCategoryTab.name; // le nom de la catégorie
		figcaptionHtml.textContent = `${title} - ${categoryName}`; 

		galleryHtml.appendChild(figureHtml);
		figureHtml.appendChild(imgHtml);
		figureHtml.appendChild(figcaptionHtml);
	});
}

window.addEventListener("DOMContentLoaded", () => {
	// Initialisation du DOM terminée, les données sont récupérées
});

// vérifie si une variable correspondant à une modale est présente dans local storage
function checkAndLoadModal() {
	const message = localStorage.getItem("message");

	if (message) {
		if (
			message === "Projet supprimé avec succès!" ||
			message === "Erreur lors de la suppression projet!"
		) {
			loadModalDel();
		} else if (
			message === "Photo ajoutée avec succès!" ||
			message === "Erreur lors de l'ajout de la photo!"
		) {
			loadModalAdd();
		}
	
	}
}
