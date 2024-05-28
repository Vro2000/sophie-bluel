const modalContainer = document.getElementById("modal-container"); //#modal-container dans index.html

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
	verifieFormulaireRempli()

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
		deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
		projectDiv.appendChild(deleteIcon);
		container.appendChild(projectDiv);

		// Configurer la fonction suppression
		deleteProject(project.id, deleteIcon);
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

function deleteProject(projectId, deleteIcon) {
	deleteIcon.addEventListener("click", async (event) => {
		event.preventDefault(); // Empêche le comportement par défaut

		const url = `http://localhost:5678/api/works/${projectId}`;
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				Accept: "*/*",
				Authorization: "Bearer " + localStorage.getItem("token"), },
		});

		if (response.ok){
		displayMessage("Projet supprimé avec succès!", "del-alerte");

		// mettre à jour le tableau projetsTab :
		const projectIndex = projetsTab.findIndex(project => project.id === projectId); //renvoi -1 si false
		if (projectIndex !== -1) { projetsTab.splice(projectIndex, 1);} //supprime depuis projectIndex jusqu'à 1 élément

		fetchProjects(); // actualise miniatures projets modal.del
		galleryProjetsFonct(0) // actualise la gallerie de index.html
		
		} else { displayMessage("Erreur lors de la suppression projet!", "del-alerte");}
	});
}

function verifieFormulaireRempli() {
    const uploadPhoto = document.querySelector("#upload-photo");
    const photoTitle = document.querySelector("#photo-title");
    const categorySelect = document.querySelector("#category-select");
    const submitButton = document.querySelector("#submit-photo");

    uploadPhoto.addEventListener("change", updateButtonState);
    photoTitle.addEventListener("input", updateButtonState);
    categorySelect.addEventListener("change", updateButtonState);

    function updateButtonState() {
        let isValid = uploadPhoto.files.length > 0 && photoTitle.value.trim() !== "" && categorySelect.value !== "";
        submitButton.className = isValid ? "valid" : "invalid";
     }
}


async function submitPhoto(form) {

	const uploadPhoto = form.querySelector("#upload-photo");
	const photoTitle = form.querySelector("#photo-title");
	const categorySelect = form.querySelector("#category-select");
	const submitButton = form.querySelector("#submit-photo");

        if (!uploadPhoto.files.length) {
            displayMessage("Veuillez ajouter une photo !", "add-alerte");
             return
        }
        if (!photoTitle.value.trim()) {
            displayMessage("Veuillez entrer un titre !", "add-alerte");
             return
        }
        if (!categorySelect.value) {
            displayMessage("Veuillez sélectionner une catégorie !", "add-alerte");
             return
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
		displayMessage("Photo ajoutée avec succès!", "add-alerte");

		// mettre à jour le tableau projetsTab :
		let newProject = await response.json();
		newProject.categoryId = parseInt(newProject.categoryId, 10); // parceque le serveur renvoi "nb" au lieu de nb
		projetsTab.push(newProject);
			
		form.reset(); // réinitialise le formulaire
		// réinitialise l'aperçu photo :
		const photoPreview = document.getElementById("photo-preview");
		photoPreview.src = "";
		photoPreview.style.display = "none";
		document.querySelector(".upload-icon").style.display = "block";  
		document.querySelector('label[for="upload-photo"]').style.display = "block"; 
		document.querySelector(".upload-info").style.display = "block"; 

		galleryProjetsFonct(0) //actualise la gallerie de index.html
	 	submitButton.className = "invalid"; // Réinitialise le css du bouton de soumission
		
	} else {
		displayMessage("Erreur lors de l'ajout de la photo!", "add-alerte"); 
	}
}


function displayMessage(message, ClassHtml) { 	// affiche les messages alertes dans les modales
	const messageAlerte = document.getElementById(ClassHtml);
	messageAlerte.innerText = message;
	setTimeout(() => { messageAlerte.innerText = ""; }, 4000); // efface le message
}


