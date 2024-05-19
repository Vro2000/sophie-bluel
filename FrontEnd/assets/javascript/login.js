document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) { throw response; }

        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);
        window.location.href = "../../index.html";

    } catch (response) {
        try {
            const errorData = await response.json();
            const messageErreur = errorData.message ? `Email ou mot de passe incorrect : ${errorData.message}.` : "Email ou mot de passe incorrect.";
            alert(messageErreur);
        } catch (error) {
            // Si une erreur se produit lors de la lecture du JSON, nous affichons un message d'erreur générique
            alert("Une erreur est survenue lors de la connexion.");
        }
    }
});
