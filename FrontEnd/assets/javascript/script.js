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
	if (!isAdmin) { // test la variable globale isadmin
		const allCategoriesTab = [{ id: 0, name: "Tous" }, ...categoriesTab]; // Ajout d'une catégorie "Tous"
		allCategoriesTab.forEach((categorie) => {
			const menuCategHtml = document.getElementById("menu-categories"); // trouve la div dans le html
			const buttonHtml = document.createElement("button");
			buttonHtml.textContent = categorie.name;
			menuCategHtml.appendChild(buttonHtml);

			if (categorie.name === "Tous") { // "Tous" est sélectionné par défaut
				buttonHtml.classList.add("active");
				galleryProjetsFonct(0);
			}

			buttonHtml.addEventListener("click", () => {
				document.querySelectorAll(".menu-categories button").forEach((btn) => {
					btn.classList.remove("active");
				});
				buttonHtml.classList.add("active"); // le bouton cliqué est selectionné
				galleryProjetsFonct(categorie.id);
			});
		});
	} else {
		loadPageAdmin();
	}
}

function loadPageAdmin() {
	const menuCategHtml = document.getElementById("menu-categories");
	menuCategHtml.style.display = "none";
	galleryProjetsFonct(0);

	const logInOut = document.getElementById("log-in-out"); // on récupère les éléments html à modifier
	const modeEdition = document.getElementById("mode-edition");
	const modifyLabel = document.querySelector("label[for='modify-btn']");

	logInOut.textContent = "logout";
	modeEdition.classList.remove("hidden");
	modifyLabel.classList.remove("hidden");

	logInOut.addEventListener("click", () => { // au click sur logout on efface le token
		localStorage.removeItem("token");
		window.location.href = "assets/html/login.html";
	});
}
function galleryProjetsFonct(categorieId) { //catégorieid transmise au click sur buttonhtml du menu
	const galleryHtml = document.querySelector(".gallery");
	galleryHtml.innerHTML = ""; // vide la galerie

	let selectedProjetsTab;
	if (categorieId === 0) {
		selectedProjetsTab = projetsTab;
	} else {
		selectedProjetsTab = projetsTab.filter((item) => item.categoryId === categorieId );
		// méthode filter() trouve dans projetTab tous ceux qui ont la bonne categorieId
	}

	selectedProjetsTab.forEach((selectedProjet) => {
		const figureHtml = document.createElement("figure");

		const imgHtml = document.createElement("img");
		imgHtml.src = selectedProjet.imageUrl;
		imgHtml.alt = selectedProjet.title;

		const figcaptionHtml = document.createElement("figcaption");
		const title = selectedProjet.title;

		// fonction find cherche l'entrée dans categoriesTab qui à la même id que le selectedProjet
		const foundCategoryTab = categoriesTab.find((item) => item.id === selectedProjet.categoryId);
		const categoryName = foundCategoryTab.name; 
		figcaptionHtml.textContent = `${title} - ${categoryName}`;

		galleryHtml.appendChild(figureHtml);
		figureHtml.appendChild(imgHtml);
		figureHtml.appendChild(figcaptionHtml);
	});
}

window.addEventListener("DOMContentLoaded", () => {
	// Initialisation du DOM terminée, les données sont récupérées
});

// Fonction pour vérifier et charger la modale si la variable est présente dans local storage
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
