document.addEventListener('DOMContentLoaded', function() {
    const usersData = JSON.parse(localStorage.getItem('users')) || [];
    const userNameSpan = document.getElementById('user-name');
    
    if (usersData.length > 0) {
      const currentUser = JSON.parse(localStorage.getItem("loggedUser"))
      userNameSpan.innerHTML = `Connecté entant que : <br> ${currentUser.firstname} ${currentUser.lastname}`;
    } 

    else {
      userNameSpan.textContent = "Utilisateur inconnu";
    }

    const apartments = JSON.parse(localStorage.getItem('appartements')) || [];
    const favoritesList = document.getElementById('favorites-list');
  
    const favoriteFlats = apartments.filter(flat => flat.isFavorite === true);
  
    function renderFavorites() {
      if (favoriteFlats.length > 0) {
        favoritesList.innerHTML = "";
  
        favoriteFlats.forEach(flat => {
          const li = document.createElement("li");
          li.className = "flat-item";
  
          const detailsDiv = document.createElement("div");
          detailsDiv.className = "flat-details";
          detailsDiv.innerHTML = `
            <strong>${flat.name}</strong>
            <p>
              ${flat.streetNumber} ${flat.streetName}, ${flat.city} |
              ${flat.price} €/mois | ${flat.area} m² |
              Construit en ${flat.yearConstruction} |
              Dispo. ${flat.disponibilityDate} |
              Clim. ${flat.hasAC ? "Oui" : "Non"}
            </p>
          `;
  
          const actionBtns = document.createElement("div");
          actionBtns.className = "action-btns";
  
          const favoriteBtn = document.createElement("button");
          favoriteBtn.className = "action-btn favorite-btn active";
          favoriteBtn.setAttribute("aria-label", "Retirer des favoris");
          favoriteBtn.innerHTML = '<i class="fas fa-heart" aria-hidden="true"></i>';
          favoriteBtn.addEventListener("click", () => {
            flat.isFavorite = false;
            localStorage.setItem('appartements', JSON.stringify(apartments));

            // Je retire du tableau local pour ne pas faire un nouveau filter
            const index = favoriteFlats.indexOf(flat);
            if (index !== -1) favoriteFlats.splice(index, 1);
            renderFavorites();
          });
  
          actionBtns.appendChild(favoriteBtn);
          li.appendChild(detailsDiv);
          li.appendChild(actionBtns);
          favoritesList.appendChild(li);
        });
      } else {
        favoritesList.innerHTML = "<li>Aucun appartement favori</li>";
      }
    }
  
    renderFavorites();

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', function() { 
      localStorage.removeItem('loggedUser');
      window.location.href = 'login.html';
    });
});