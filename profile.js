document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById('profile-form');

    const currentUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (!currentUser) {
        window.location.href = '/JAVASCRIPT/EASE-PROJECT/PAGES/login.html';
        return;
    }

    document.getElementById('profile-firstname').value = currentUser.firstname;
    document.getElementById('profile-lastname').value = currentUser.lastname;
    document.getElementById('profile-birthdate').value = currentUser.birthdate;
    document.getElementById('profile-email').value = currentUser.email;
    document.getElementById('profile-password').value = currentUser.password || "";
    document.getElementById('profile-confirm-password').value = currentUser.password || "";

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let errors = [];

        const firstname = document.getElementById('profile-firstname').value.trim();
        const lastname = document.getElementById('profile-lastname').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        const birthdate = document.getElementById('profile-birthdate').value;
        const password = document.getElementById('profile-password').value;
        const confirmPassword = document.getElementById('profile-confirm-password').value;

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
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }

        if (!birthdate || isNaN(birthDateObj.getTime()) || age < 18 || age > 120) {
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
            const input = document.getElementById(`profile-${field}`);
            const errorSpan = input.parentElement.querySelector('.validation-error');

            if (errorSpan) {
                errorSpan.textContent = ""; 
            }
        });

        if (errors.length > 0) {
        errors.forEach(error => {
            const input = document.getElementById(`profile-${error.field}`);
            const errorSpan = input.parentElement.querySelector('.validation-error');
            if (errorSpan) {
                errorSpan.textContent = error.message;
            }
        });

        console.log("Erreurs détectées :", errors);
        }

        else {
            currentUser.firstname = firstname;
            currentUser.lastname = lastname;
            currentUser.email = email;
            currentUser.birthdate = birthdate;
            currentUser.password = password;
            
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(user => user.email === currentUser.email);

            if (userIndex !== -1){
                users[userIndex] = currentUser
            }

            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('loggedUser', JSON.stringify(currentUser));
            window.location.href = '/EASE-PROJECT/PAGES/index.html';
        }
    });
})
