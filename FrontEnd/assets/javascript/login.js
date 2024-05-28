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
            body: JSON.stringify({ // converti au format json
                email: email,
                password: password
            })
        });

        if (!response.ok) { throw response; }

        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token); // stockage token
        window.location.href = "../../index.html";

    } catch (response) {
            console.log(response)
            alert("Email ou mot de passe incorrect.");
        
    }
});
