document.addEventListener("DOMContentLoaded", function () {
    const modalContainer = document.getElementById("modal-container");
    const modifyBtn = document.getElementById("modify-btn");

    modifyBtn.addEventListener("click", function () {
        fetch("./assets/html/modal-del.html")
            .then(response => response.text())
            .then(html => {
                modalContainer.innerHTML = html;
                modalDelEvents();
                fetchProjects();
            })
            .catch(error => console.error("Erreur chargement modal-del", error));
    });

    function loadModalDell() {
        fetch("./assets/html/modal-del.html")
            .then(response => response.text())
            .then(html => {
                const modalContainer = document.getElementById("modal-container");
                modalContainer.innerHTML = html;
                const modal = document.getElementById("modal-del-id");
                modal.style.display = "flex";
                modalDelEvents(); 
                fetchProjects(); 
            })
            .catch(error => console.error("Erreur chargement modal-del:", error));
    }

    function modalDelEvents() {
        const modal = document.querySelector(".modal");
      
        // Ferme la modal lorsqu'on clique sur le bouton close
        const closeBtn = modal.querySelector(".close");
        closeBtn.addEventListener("click", function() {
            modal.style.display = "none";
        });

        // Ferme la modal en cliquant à l'extérieur de son contenu
        window.addEventListener("click", function(event) {
            const modal = document.querySelector(".modal");
            if (!modal.contains(event.target)) {
                modal.style.display = "none";
            }
        });
    
        // Bouton ajouter une photo sur modal 1
        const addPhotoBtn = modal.querySelector("#add-photo-btn");
        if (addPhotoBtn) {
            addPhotoBtn.addEventListener("click", loadModalAdd);
        }
    }

    function loadModalAdd() {
        fetch("./assets/html/modal-add.html")
            .then(response => response.text())
            .then(html => {
                modalContainer.innerHTML = html;
                modalAddEvents();  
            })
            .catch(error => console.error("Erreur fonction loadModalAdd:", error));
    }

    function modalAddEvents() {
        const modal = document.getElementById("modal-add-id");
        modal.style.display = "flex";

        // Ferme la modal lorsqu'on clique sur le bouton close
        const closeBtn = modal.querySelector(".close");
        closeBtn.addEventListener("click", function() {
            modal.style.display = "none";
        });

        // Ajoute un gestionnaire pour fermer la modal en cliquant à l'extérieur de son contenu
        window.addEventListener("click", function(event) {
            const modal = document.querySelector(".modal");
            if (!modal.contains(event.target)) {
                modal.style.display = "none";
            }
        });

        // Ajoute un gestionnaire pour revenir sur la première modal
        const backBtn = modal.querySelector(".back");
        if (backBtn) {
            backBtn.addEventListener("click", loadModalDell);
        }

        const submitButton = document.getElementById("submit-photo");
        if (submitButton) {
            submitButton.addEventListener("click", function(event) {
                event.preventDefault(); // Empêche le comportement de soumission par défaut
                console.log("Bouton cliqué"); // Confirmer le clic
                submitPhoto(); // Appelle votre fonction de soumission de photo
            });
            console.log("Écouteur attaché au bouton submit-photo");
        } else {
            console.log("Le bouton submit-photo n'a pas été trouvé dans le DOM");
        }

        uploadPhotoEvents();
        fetchCategories();
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
                document.querySelector('label[for="upload-photo"]').style.display = "none";
                document.querySelector(".upload-info").style.display = "none";
            }
        });
    }

    function fetchProjects() {
        const urlWorks = "http://localhost:5678/api/works";
        fetch(urlWorks)
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById("project-list");
                container.innerHTML = "";

                // Ajout des works récupérées via l'API
                data.forEach(project => {
                    const projectDiv = document.createElement("div");
                    projectDiv.className = "project-item";
                    projectDiv.innerHTML = `
                        <img src="${project.imageUrl}" alt="${project.title}">
                        <span class="delete-icon" onclick="deleteProject(${project.id})">&#128465;</span>`;
                    container.appendChild(projectDiv);
                });
            })
            .catch(error => console.error("Erreur fonction fetchProjects:", error));
    }

    function deleteProject(projectId) {
        const url = `http://localhost:5678/api/works/${projectId}`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            console.log('Projet supprimé avec succès', data);
            fetchProjects(); // Actualise la liste des projets après la suppression
        })
        .catch(error => {
            console.error('Erreur lors de la suppression du projet:', error);
            alert('Erreur lors de la suppression du projet: ' + error.message);
        });
    }

    function fetchCategories() {
        const urlCategories = "http://localhost:5678/api/categories";
        fetch(urlCategories)
            .then(response => response.json())
            .then(categories => {
                const select = document.getElementById("category-select");
                select.innerHTML = ""; // Vide le contenu existant du select

                // Créer une option vide
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                select.appendChild(defaultOption);

                // Ajout des catégories récupérées via l'API
                categories.forEach(category => {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.textContent = category.name;
                    select.appendChild(option);
                });
            })
            .catch(error => console.error("Erreur fonction fetchCategories:", error));
    }

    function submitPhoto() {
        const uploadPhoto = document.getElementById("upload-photo");
        const photoTitle = document.getElementById("photo-title");
        const categorySelect = document.getElementById("category-select");

        const formData = new FormData();
        formData.append("image", uploadPhoto.files[0]);
        formData.append("title", photoTitle.value);
        formData.append("category", categorySelect.value);

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            console.log("Succès :", data);
            alert("Photo ajoutée avec succès!");
        })
        .catch(error => {
            console.error("Erreur :", error);
            alert("Erreur lors de l'ajout de la photo: " + error.message);
        });
    }
});
