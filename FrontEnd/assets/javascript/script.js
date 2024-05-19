const isAdmin = Boolean(localStorage.getItem("token"));
let projetsTab = [];
let categoriesTab = [];
let activeModal = undefined;

Promise.all([
	fetch("http://localhost:5678/api/works").then((response) => response.json()),
	fetch("http://localhost:5678/api/categories").then((response) =>
		response.json()
	),
]).then((ResponsesTab) => {
	projetsTab = ResponsesTab[0];
	categoriesTab = ResponsesTab[1];
	loadPageFonct();
	checkAndLoadModal(); // Vérifier et charger la modale si nécessaire
});

function loadPageFonct() {
	if (!isAdmin) {
		const allCategoriesTab = [{ id: 0, name: "Tous" }, ...categoriesTab]; // Ajout d'une catégorie "Tous"
		allCategoriesTab.forEach((categorie) => {
			const menuCategHtml = document.getElementById("menu-categories");
			const buttonHtml = document.createElement("button");
			buttonHtml.textContent = categorie.name;
			menuCategHtml.appendChild(buttonHtml);

			if (categorie.name === "Tous") {
				// indique "Tous" sélectionné par défaut
				buttonHtml.classList.add("active");
				selectedProjetsFonct(0);
			}

			buttonHtml.addEventListener("click", () => {
				document.querySelectorAll(".menu-categories button").forEach((btn) => {
					btn.classList.remove("active");
				});
				buttonHtml.classList.add("active");
				selectedProjetsFonct(categorie.id);
			});
		});
	} else {
		loadPageAdmin();
	}
}

function loadPageAdmin() {
	const menuCategHtml = document.getElementById("menu-categories");
	menuCategHtml.style.display = "none";
	selectedProjetsFonct(0);

	const logInOut = document.getElementById("log-in-out");
	const modeEdition = document.getElementById("mode-edition");
	const modifyLabel = document.querySelector("label[for='modify-btn']");

	logInOut.textContent = "logout";
	modeEdition.classList.remove("hidden");
	modifyLabel.classList.remove("hidden");

	logInOut.addEventListener("click", () => {
		localStorage.removeItem("token");
		window.location.href = "assets/html/login.html";
	});
}

function selectedProjetsFonct(categorieId) {
	const galleryHtml = document.querySelector(".gallery");
	galleryHtml.innerHTML = "";

	let selectedProjetsTab;
	if (categorieId === 0) {
		selectedProjetsTab = projetsTab;
	} else {
		selectedProjetsTab = projetsTab.filter(
			(projets) => projets.categoryId === categorieId
		);
	}

	selectedProjetsTab.forEach((projet) => {
		const figureHtml = document.createElement("figure");

		const imgHtml = document.createElement("img");
		imgHtml.src = projet.imageUrl;
		imgHtml.alt = projet.title;

		const figcaptionHtml = document.createElement("figcaption");
		const title = projet.title;
		const foundCategory = categoriesTab.find(
			(categorie) => categorie.id === projet.categoryId
		);
		const categoryName = foundCategory.name;
		figcaptionHtml.textContent = `${title} - ${categoryName}`;

		galleryHtml.appendChild(figureHtml);
		figureHtml.appendChild(imgHtml);
		figureHtml.appendChild(figcaptionHtml);
	});
}

window.addEventListener("DOMContentLoaded", () => {
	// Initialisation du DOM terminée, les données sont récupérées
});

// Fonction pour vérifier et charger la modale si la variable est présente
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
