const modalContainer = document.getElementById("modal-container");
const modifyBtn = document.getElementById("modify-btn");

modifyBtn.addEventListener("click", function () {
	loadModalDel();
});

async function loadModalDel() {
	const response = await fetch(`./assets/html/modal-del.html`);
	const html = await response.text();
	activeModal = "modal-del.html";
	modalContainer.innerHTML = html;
	const modal = document.getElementById("modal-del-id");
	modal.style.display = "flex";
	closeModalEvents(modal);
	fetchProjects();

	// Récupérer le message de localStorage
	const message = localStorage.getItem("message");
	displayMessage(message, "del-alerte");
	localStorage.removeItem("message");

	const addPhotoBtn = document.getElementById("add-photo-btn");
	if (addPhotoBtn) {
		addPhotoBtn.addEventListener("click", loadModalAdd);
	}
}

async function loadModalAdd() {
	const response = await fetch(`./assets/html/modal-add.html`);
	const html = await response.text();
	activeModal = "modal-add.html";
	modalContainer.innerHTML = html;
	const modal = document.getElementById("modal-add-id");
	modal.style.display = "flex";

	// Stop propagation
	const photoForm = document.getElementById("photo-form");
	if (photoForm) {
		photoForm.addEventListener("click", function (e) {
			e.stopPropagation();
		});
	}
	closeModalEvents(modal);
	uploadPhotoEvents();
	fetchCategories();

	// Récupérer le message de localStorage
	const message = localStorage.getItem("message");
	displayMessage(message, "add-alerte");
	localStorage.removeItem("message");

	const backBtn = modal.querySelector(".back");
	if (backBtn) {
		backBtn.addEventListener("click", loadModalDel);
	}
}

function closeModalEvents(modal) {
	const closeBtn = modal.querySelector(".close");
	closeBtn.addEventListener("click", function (event) {
		if (event.target === closeBtn) {
			modal.style.display = "none";
			activeModal = "closebtn";
		}
	});

	window.addEventListener("click", function (e) {
		// Vérifiez si le clic était en dehors de la modale ET si le clic n'est pas sur un label lié à un input dans la modale
		if (
			e.target !== modal &&
			!modal.contains(e.target) &&
			!(e.target.tagName === "label")
		) {
			modal.style.display = "none";
			activeModal = "closewindow";
		}
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
	const select = document.getElementById("category-select");

	// Créer une option vide
	const defaultOption = document.createElement("option");
	defaultOption.value = "";
	select.appendChild(defaultOption);

	// Ajout des catégories récupérées via l'API au début
	categoriesTab.forEach((category) => {
		const option = document.createElement("option");
		option.value = category.id;
		option.textContent = category.name;
		select.appendChild(option);
	});
}

function uploadPhotoEvents() {
	const uploadPhoto = document.getElementById("upload-photo");
	const photoPreview = document.getElementById("photo-preview");
	uploadPhoto.addEventListener("change", function () {
		if (this.files && this.files[0]) {
			photoPreview.src = URL.createObjectURL(this.files[0]);
			photoPreview.onload = function () {
				URL.revokeObjectURL(photoPreview.src);
			};
			photoPreview.style.display = "block";
			document.querySelector(".upload-icon").style.display = "none";
			document.querySelector('label[for="upload-photo"]').style.display =
				"none";
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
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
		});

		console.log(response); // Affiche les détails de la réponse dans la console

		if (response.ok) {
			localStorage.setItem("message", "Projet supprimé avec succès!");
		} else {
			localStorage.setItem("message", "Erreur lors de la suppression projet!");
		}
	});
}

document.body.addEventListener(
	"submit",
	function (event) {
		const form = event.target.closest("#photo-form");
		if (form) {
			event.preventDefault();
			submitPhoto(form);
		}
	},
	true
);

async function submitPhoto(form) {
	const uploadPhoto = form.querySelector("#upload-photo");
	const photoTitle = form.querySelector("#photo-title");
	const categorySelect = form.querySelector("#category-select");

	if (!uploadPhoto.files.length) {
		displayMessage("Veuillez ajouter une photo !", "add-alerte");
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

	const formData = new FormData();
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

function displayMessage(message, alertId) {
	const messageAlerte = document.getElementById(alertId);
	if (messageAlerte) {
		messageAlerte.innerText = message;

		setTimeout(() => {
			messageAlerte.innerText = "";
		}, 5000);
	} else {
		console.error("Element #" + alertId + " not found in the DOM");
	}
}
