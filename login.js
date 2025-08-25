document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    let errors = [];

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    let users = JSON.parse(localStorage.getItem('users'));
    
    if (!Array.isArray(users)){
        users = []
    }
    const matchedUser = users.find(user => user.email === email && user.password === password);

    if (!matchedUser) {
        errors.push({ field: 'email', message: "L'adresse email est inconnue ou le mot de passe est incorrect." });
        errors.push({ field: 'password', message: "L'adresse email est inconnue ou le mot de passe est incorrect." });
    }

    // J'efface les messages d'erreur précédents
    const fields = ['email', 'password'];
    fields.forEach(field => {
        const input = document.getElementById(`login-${field}`);
        const errorSpan = input.nextElementSibling;
        if (errorSpan) {
            errorSpan.textContent = "";
        }
    });

    if (errors.length > 0) {
        errors.forEach(error => {
            const input = document.getElementById(`login-${error.field}`);
            const errorSpan = input.nextElementSibling;
            if (errorSpan) {
                errorSpan.textContent = error.message;
            }
        });
        console.log("Erreurs détectées :", errors);
    }
    else {
        console.log("Connexion réussie pour :", matchedUser);
        localStorage.setItem("loggedUser", JSON.stringify(matchedUser));
        window.location.href = '/JAVASCRIPT/EASE-PROJECT/PAGES/index.html';
    }
});