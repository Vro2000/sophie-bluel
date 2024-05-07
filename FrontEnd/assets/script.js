const urlWorks = 'http://localhost:5678/api/works'; // URLs récupérées sur Swagger execute get...
const urlCategories = 'http://localhost:5678/api/categories';

Promise.all([ // pour effectuer plusieurs fetch en même temps
    fetch(urlWorks).then(response => response.json()),  // la méthode .json permet d'extraire dans la réponse globale du serveur, 
    fetch(urlCategories).then(response => response.json())   // la partie qui correspond aux données .json
])

.then(ResponsesTab => { // on stocke les données récupérées dans tableau ResponsesTab

    const projetsTab = ResponsesTab[0]; // stocke les résultats de la première URL
    let categoriesTab = ResponsesTab[1]; // stocke les résultats de la deuxième URL
                                //let au lieu de const permet de modifier la variable catégorie après la fonction "set"

                                // ajout de doublons pour tester
                                categoriesTab.push(
                                    { id: 5, name: 'Objets' },
                                    { id: 6, name: 'Appartements' }
                                );
                                console.log("Ajout doublon : ", [...categoriesTab]);

    // trier les doublons avec la fonction set :
   const setCategoriesTab = new Set(); // stocke les données (fonctionne avec has et add)
   console.log("test avec set : ", [...setCategoriesTab]);

   categoriesTab = categoriesTab.filter(categorie => { 
       const isDuplicate = setCategoriesTab.has(categorie.name);
       setCategoriesTab.add(categorie.name);
       return !isDuplicate;
   });
   console.log("test avec set setCategoriesTab : ", [...setCategoriesTab]);
   console.log("test avec set categoriesTab : ", [...categoriesTab]);

    // trier les doublons avec un tableau (cette fonction est juste pour la démonstration mais pas utilisée):
    let setCategories2Tab = [];
    let categories2Tab = categoriesTab.filter(categorie => {
        const isDuplicate = setCategories2Tab.includes(categorie.name);
        if (!isDuplicate) {
            setCategories2Tab.push(categorie.name);
            return true;
        }
        return false;
    });
    console.log("test avec tableau setCategories2Tab : ", [...setCategories2Tab]);
    console.log("test avec tableau categories2Tab : ", [...categories2Tab]);

    // Créer le menu des catégories
    const menuHtml = document.getElementById('menuCategories');
    const allCategoriesTab = [{ id: 0, name: 'Tous' }, ...categoriesTab]; // Ajouter l'option "Tous" suivie de categorie

    allCategoriesTab.forEach(allCategorie => {
        const buttonHtml = document.createElement('button');
        buttonHtml.textContent = allCategorie.name;
        menuHtml.appendChild(buttonHtml);
        
        if (allCategorie.name === 'Tous') {
            buttonHtml.classList.add('active'); // Marquer "Tous" comme actif par défaut
        }
 
        // lancer la fonction d'affichage des projets
        selectProjetsFonct(0, projetsTab, categoriesTab); // par défaut Affichage de tous les projets

        buttonHtml.onclick = () => {
            
            document.querySelectorAll('.menu-categories button').forEach(btn => {
                btn.classList.remove('active'); // Supprimer la classe "active" de tous les boutons
            });
             buttonHtml.classList.add('active'); // Ajouter la classe "active" au bouton cliqué
             selectProjetsFonct(allCategorie.id, projetsTab, categoriesTab); // allCategorie est le tableau modifié avec l'option "Tous"
        };
    });
})

function selectProjetsFonct(selectCategoryId, projetsTab, categoriesTab) { //les attributs sont renseignés par un click sur buttonHtml

    const galleryHtml = document.querySelector('.gallery'); // Sélectionne la div class gallery
    galleryHtml.innerHTML = '';  // Vide la div gallery de ses éléments actuels

// définir quelle catégorie de projets afficher   
    let selectProjetsTab;

        if (selectCategoryId === 0) {
            // Si selectCategoryId est 0, sélectionne tous les projets
            selectProjetsTab = projetsTab;
        } else {
            // Si selectCategoryId n'est pas 0, sélectionne uniquement les projets appartenant à la catégorie spécifiée
            selectProjetsTab = projetsTab.filter(projet => projet.categoryId === selectCategoryId);
        }

        console.log("contenu de selectProjetsTab après click : ", [...selectProjetsTab]);

//créer les balises figure, img et figcaption

    selectProjetsTab.forEach(selectProjet => {
        const figureHtml = document.createElement('figure');
        const imgHtml = document.createElement('img');
        imgHtml.src = selectProjet.imageUrl;
        imgHtml.alt = selectProjet.title;

        // Étape 1: créer les sous-titres
        const figcaptionHtml = document.createElement('figcaption');

        // Étape 2: Trouver la catégorie correspondante
        const projectCategoryId = selectProjet.categoryId;
        const foundCategory = categoriesTab.find(categorie => categorie.id === projectCategoryId);
        
        // Étape 3: Construire le contenu du `figcaption`
        const title = selectProjet.title;
        const categoryName = foundCategory.name;
        figcaptionHtml.textContent = `${title} - ${categoryName}`;

        galleryHtml.appendChild(figureHtml);
        figureHtml.appendChild(imgHtml);
        figureHtml.appendChild(figcaptionHtml);
    });

}
