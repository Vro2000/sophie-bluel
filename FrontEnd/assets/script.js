window.onload = function() {
     const url = 'http://localhost:5678/api/works'; // Url récupérée dans swagger get work execute
  
     fetch(url)
     
     .then(response => {
         if (!response.ok) {
             // Vérifie si la réponse du serveur est réussie ou pas (status 200-299)
             throw new Error('erreur réponse serveur: ' + response.statusText);
         }
         return response.json();  // la méthode .json permet d'extraire dans la réponse globale du serveur, 
     })                         // la partie qui correspond aux données .json


    .then(jsonData => { //on déclare et construit le tableau ici et on lance le reste :

        const gallery = document.querySelector('.gallery'); // Sélectionne la div gallery
        gallery.innerHTML = '';  // Vide la galerie de ses éléments actuels
    
        // Boucle sur le tableau jsonData et crée les nouveaux éléments figure pour chaque projet
        jsonData.forEach(work => {
            const figure = document.createElement('figure');
            figure.id = `work-${work.id}`; // Ajout de l'ID du projet
        
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title;
            
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = work.title;
        
            // Ajouter des attributs supplémentaires, tels que categoryId et userId, comme des data-attributes
            figure.setAttribute('data-category-id', work.categoryId);
            figure.setAttribute('data-user-id', work.userId);
            figure.setAttribute('data-category-name', work.category.name);
        
            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });
    })
    .catch(error => {
        console.error('Erreur chargement des données:', error);
        alert('Erreur chargement des données: ' + error.message);
    });
};