const modalContainer = document.getElementById("modal-container");
const modifyBtn = document.getElementById("modify-btn");

modifyBtn.addEventListener("click", function () {
	loadModalDel();
});

async function loadModalDel() {
	const response = await fetch(`./assets/html/modal-del.html`);
	const html = await response.text();
	modalContainer.innerHTML = html;
	const modal = document.getElementById("modal-del-id");
	modal.style.display = "flex";
	closeModalEvents(modal);
	fetchProjects();

	const message = localStorage.getItem("message"); // Récupére le message de localStorage
	displayMessage(message, "del-alerte"); // transmet le message et l'élement #html à implémenter
	localStorage.removeItem("message"); // vide localStorage

	const addPhotoBtn = document.getElementById("add-photo-btn");
	addPhotoBtn.addEventListener("click", loadModalAdd);
}

async function loadModalAdd() {
	const response = await fetch(`./assets/html/modal-add.html`);
	const html = await response.text();
	modalContainer.innerHTML = html;
	const modal = document.getElementById("modal-add-id");
	modal.style.display = "flex";

	closeModalEvents(modal);
	uploadPhotoEvents();
	fetchCategories();

	const message = localStorage.getItem("message"); // Récupérer le message de localStorage
	displayMessage(message, "add-alerte"); // transmet le message et l'élement #html à implémenter
	localStorage.removeItem("message"); // vide localStorage

	const backBtn = modal.querySelector(".back");
	backBtn.addEventListener("click", loadModalDel);

	const form = document.getElementById('photo-form');
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Empêcher le comportement par défaut de soumission de formulaire
	        submitPhoto(form); // Appeler la fonction pour gérer la soumission
        });
    
}

function closeModalEvents(modal) {

	const closeBtn = modal.querySelector(".close");
	closeBtn.addEventListener("click", function () { modal.style.display = "none";
	});
	window.addEventListener("click", function (e) { // Vérifiez si le clic était en dehors de la modale
		if ( e.target !== modal && !modal.contains(e.target)) { modal.style.display = "none"; }
	});
}

function fetchProjects() {
	const container = document.getElementById("project-list");
	container.innerHTML = "";

	// Ajout des works récupérées via l'API
	projetsTab.forEach((project) => {
		const projectDiv = document.createElement("div");
		projectDiv.className = "project-item";
		projectDiv.innerHTML = `<img src="${project.imageUrl}" alt="${project.title}">`;

		// Créer un élément icône poubelle
		const deleteIcon = document.createElement("span");
		deleteIcon.classList.add("delete-icon");
		deleteIcon.innerHTML = "&#128465;";
		projectDiv.appendChild(deleteIcon);
		container.appendChild(projectDiv);

		// Configurer la fonction suppression
		deleteProject(deleteIcon, project.id);
	});
}

function fetchCategories() {
	const categorySelectHtml = document.getElementById("category-select");

	// Créer une option vide
	const defaultOption = document.createElement("option");
	defaultOption.value = "";
	categorySelectHtml.appendChild(defaultOption);

	// Ajout des catégories récupérées via l'API au début
	categoriesTab.forEach((category) => {
		const option = document.createElement("option");
		option.value = category.id;
		option.textContent = category.name;
		categorySelectHtml.appendChild(option);
	});
}

function uploadPhotoEvents() {
    const uploadPhoto = document.getElementById("upload-photo");
    const photoPreview = document.getElementById("photo-preview");

    uploadPhoto.addEventListener("change", function () {
        if (this.files.length > 0) { 
            photoPreview.src = URL.createObjectURL(this.files[0]);
            photoPreview.onload = function () {URL.revokeObjectURL(photoPreview.src);};  // Libére la ressource après le chargement
            photoPreview.style.display = "block"; 
            document.querySelector(".upload-icon").style.display = "none";  
            document.querySelector('label[for="upload-photo"]').style.display = "none"; 
            document.querySelector(".upload-info").style.display = "none"; 
        }
    });
}

function deleteProject(deleteIcon, projectId) {
	deleteIcon.addEventListener("click", async (event) => {
		event.preventDefault(); // Empêche le comportement par défaut

		const url = `http://localhost:5678/api/works/${projectId}`;
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				Accept: "*/*",
				Authorization: "Bearer " + localStorage.getItem("token"), },
		});

		if (response.ok) { localStorage.setItem("message", "Projet supprimé avec succès!");
		} else { localStorage.setItem("message", "Erreur lors de la suppression projet!"); }
	});
}


async function submitPhoto(form) {
	
	const uploadPhoto = form.querySelector("#upload-photo");
	const photoTitle = form.querySelector("#photo-title");
	const categorySelect = form.querySelector("#category-select");

	if (!uploadPhoto.files.length) {
		displayMessage("Veuillez ajouter une photo !", "add-alerte"); //(message , classname)
		return;
	}
	if (!photoTitle.value.trim()) {
		displayMessage("Veuillez entrer un titre !", "add-alerte");
		return;
	}
	if (!categorySelect.value) {
		displayMessage("Veuillez sélectionner une catégorie !", "add-alerte");
		return;
	}
	const formData = new FormData(); // récupération des données saisies pour construire le formulaire
	formData.append("image", uploadPhoto.files[0]);
	formData.append("title", photoTitle.value);
	formData.append("category", categorySelect.value);

	const response = await fetch("http://localhost:5678/api/works", {
		method: "POST",
		body: formData,
		headers: {
			Accept: "application/json",
			Authorization: "Bearer " + localStorage.getItem("token"),
		},
	});

	if (response.ok) {
		localStorage.setItem("message", "Photo ajoutée avec succès!");
	} else {
		localStorage.setItem("message", "Erreur lors de l'ajout de la photo!");
	}
}

function displayMessage(message, ClassHtml) { 	// affiche les messages alertes dans les modales
	const messageAlerte = document.getElementById(ClassHtml);
	messageAlerte.innerText = message;
	setTimeout(() => { messageAlerte.innerText = ""; }, 5000); // efface le message
}
