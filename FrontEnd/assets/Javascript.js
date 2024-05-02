
const jsonData = [
  {  
    "id": 1,
    "title": "Abajour Tahina",
    "imageUrl": "http://localhost:5678/images/abajour-tahina1651286843956.png",
    "categoryId": 1,
    "userId": 1,
    "category": {
      "id": 1,
      "name": "Objets"
    }
  },
  {
    "id": 2,
    "title": "Appartement Paris V",
    "imageUrl": "http://localhost:5678/images/appartement-paris-v1651287270508.png",
    "categoryId": 2,
    "userId": 1,
    "category": {
      "id": 2,
      "name": "Appartements"
    }
  },
  {
    "id": 3,
    "title": "Restaurant Sushisen - Londres",
    "imageUrl": "http://localhost:5678/images/restaurant-sushisen-londres1651287319271.png",
    "categoryId": 3,
    "userId": 1,
    "category": {
      "id": 3,
      "name": "Hotels & restaurants"
    }
  },
  {
    "id": 4,
    "title": "Villa “La Balisiere” - Port Louis",
    "imageUrl": "http://localhost:5678/images/la-balisiere1651287350102.png",
    "categoryId": 2,
    "userId": 1,
    "category": {
      "id": 2,
      "name": "Appartements"
    }
  },
  {
    "id": 5,
    "title": "Structures Thermopolis",
    "imageUrl": "http://localhost:5678/images/structures-thermopolis1651287380258.png",
    "categoryId": 1,
    "userId": 1,
    "category": {
      "id": 1,
      "name": "Objets"
    }
  },
  {
    "id": 6,
    "title": "Appartement Paris X",
    "imageUrl": "http://localhost:5678/images/appartement-paris-x1651287435459.png",
    "categoryId": 2,
    "userId": 1,
    "category": {
      "id": 2,
      "name": "Appartements"
    }
  },
  {
    "id": 7,
    "title": "Pavillon “Le coteau” - Cassis",
    "imageUrl": "http://localhost:5678/images/le-coteau-cassis1651287469876.png",
    "categoryId": 2,
    "userId": 1,
    "category": {
      "id": 2,
      "name": "Appartements"
    }
  },
  {
    "id": 8,
    "title": "Villa Ferneze - Isola d’Elba",
    "imageUrl": "http://localhost:5678/images/villa-ferneze1651287511604.png",
    "categoryId": 2,
    "userId": 1,
    "category": {
      "id": 2,
      "name": "Appartements"
    }
  },
  {
    "id": 9,
    "title": "Appartement Paris XVIII",
    "imageUrl": "http://localhost:5678/images/appartement-paris-xviii1651287541053.png",
    "categoryId": 2,
    "userId": 1,
    "category": {
      "id": 2,
      "name": "Appartements"
    }
  },
  {
    "id": 10,
    "title": "Bar “Lullaby” - Paris",
    "imageUrl": "http://localhost:5678/images/bar-lullaby-paris1651287567130.png",
    "categoryId": 3,
    "userId": 1,
    "category": {
      "id": 3,
      "name": "Hotels & restaurants"
    }
  },
  {
    "id": 11,
    "title": "Hotel First Arte - New Delhi",
    "imageUrl": "http://localhost:5678/images/hotel-first-arte-new-delhi1651287605585.png",
    "categoryId": 3,
    "userId": 1,
    "category": {
      "id": 3,
      "name": "Hotels & restaurants"
    }
  }
]

window.onload = function() {
  
  const gallery = document.querySelector('.gallery'); // Sélectionne la div gallery
  gallery.innerHTML = '';  // Vide la galerie de ses éléments actuels

  // Boucle sur les données JSON et crée les nouveaux éléments figure pour chaque projet
  jsonData.forEach(project => {
    const figure = document.createElement('figure');
    figure.id = `project-${project.id}`; // Ajout de l'ID du projet

    const img = document.createElement('img');
    img.src = project.imageUrl;
    img.alt = project.title;
    
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = project.title;

    // Ajouter des attributs supplémentaires, tels que categoryId et userId, comme des data-attributes
    figure.setAttribute('data-category-id', project.categoryId);
    figure.setAttribute('data-user-id', project.userId);
    figure.setAttribute('data-category-name', project.category.name);

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
});
};

