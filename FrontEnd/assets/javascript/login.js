// Ajout d'un écouteur d'événement 'submit' sur le formulaire d'identification
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Empêche l'envoi standard du formulaire pour permettre la manipulation des données

    // Récupération des valeurs entrées dans les champs de formulaire
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Envoi des données au serveur via une requête POST
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',  // Méthode HTTP utilisée pour l'envoi des données
        headers: {  // Définition des en-têtes de la requête
            'accept': 'application/json',  // Indique que le client attend du JSON en retour
            'Content-Type': 'application/json'  // Indique que le corps de la requête contient du JSON
        },
        body: JSON.stringify({  // Transformation de l'objet contenant les données en une chaîne JSON
            email: email,  // Email saisi par l'utilisateur
            password: password  // Mot de passe saisi par l'utilisateur
        })
    })
    .then(response => {
        if (!response.ok) {  // Vérifie si la requête a échoué
            throw response;  // Lance une exception si la réponse n'est pas OK
        }
        return response.json();  // Récupère la réponse sous forme de JSON
    })
    .then(data => {
        // Actions à effectuer en cas de connexion réussie
        const token = data.token;  // Récupération du jeton depuis la réponse
        const userId = data.userId;  // Récupération de l'identifiant de l'utilisateur
        localStorage.setItem("token", token); // Stockage du jeton dans le localStorage
        localStorage.setItem("userId", userId); // Stockage de l'identifiant utilisateur
        window.location.href = "../../index.html"; // Redirection vers la page d'accueil
    })
    .catch(response => {
        // Gestion des erreurs si la requête fetch échoue ou renvoie une erreur
        response.json().then(errorData => {
            // Construction du message d'erreur basé sur la réponse de l'API
            const messageErreur = errorData.message ? `${errorData.message}. (Les données transmises ne sont pas reconnues.)` : "Les données transmises ne sont pas reconnues.";
            alert(messageErreur); // Affichage d'une alerte avec le message d'erreur
        });
    });
});
