document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById('register-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let errors = [];

        const firstname = document.getElementById('register-firstname').value.trim();
        const lastname = document.getElementById('register-lastname').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const birthdate = document.getElementById('register-birthdate').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*\W).{6,}$/;

        if (firstname.length < 2) {
            errors.push({ field: 'firstname', message: "Le prénom doit comporter au moins 2 caractères." });
        }
        
        if (lastname.length < 2) {
            errors.push({ field: 'lastname', message: "Le nom doit comporter au moins 2 caractères." });
        }

        if (!emailRegex.test(email)) {
            errors.push({ field: 'email', message: "Email invalide." });
        }
        
        const birthDateObj = new Date(birthdate);
        const today = new Date();
        let ageValue = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            ageValue--;
        }

        if (!birthdate || isNaN(birthDateObj.getTime()) || ageValue < 18 || ageValue > 120) {
            errors.push({ field: 'birthdate', message: "Vous devez avoir entre 18 et 120 ans." });
        }
        
        if (!passwordRegex.test(password)) {
            errors.push({ field: 'password', message: "Le mot de passe doit comporter au moins 6 caractères, contenir des lettres, des chiffres et un caractère spécial." });
        }

        if (password !== confirmPassword){
            errors.push({ field: 'confirm-password', message: "La confirmation du mot de passe est mauvaise, veuillez ressayer."})
        }

        const fields = ['firstname', 'lastname', 'email', 'birthdate', 'password' , 'confirm-password'];
        fields.forEach(field => {
            const input = document.getElementById(`register-${field}`);
            const errorSpan = input.parentElement.querySelector('.validation-error');

            if (errorSpan) {
                errorSpan.textContent = "";
            }
        });

        if (errors.length > 0) {
        errors.forEach(error => {
            const input = document.getElementById(`register-${error.field}`);
            const errorSpan = input.parentElement.querySelector('.validation-error');
            if (errorSpan) {
                errorSpan.textContent = error.message;
            }
        });

        console.log("Erreurs détectées :", errors);
        }

        else {
            const newUser = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                age: ageValue,
                password: password
            };

            let users = JSON.parse(localStorage.getItem('users'));

            if (!Array.isArray(users)){
                users = []
            }

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            console.log("Utilisateur enregistré :", newUser);
            
            document.getElementById('register-form').reset();

            window.location.href = '/JAVASCRIPT/EASE-PROJECT/PAGES/login.html';
        }
        
        });
    });
    document.getElementById('navigate-button').addEventListener('click', function() {
        window.location.href = '/JAVASCRIPT/EASE-PROJECT/PAGES/login.html';
})
