// Ajout d'une classe pour permettre l'organisation du code et réutilisation.
class ApartmentManager {
    constructor() {
        // Charger les appartements depuis localStorage.
        this.flats = JSON.parse(localStorage.getItem("appartements")) || [
            {
                name: "Appartement Moderne",
                city: "Paris",
                streetName: "Rue de la Paix",
                streetNumber: 42,
                price: 1500,
                area: 65,
                hasAC: true,
                yearConstruction: 2010,
                disponibilityDate: "2024-07-01",
                isFavorite: false,
                id: Date.now()
            },
        
            {
                name: "Loft Industriel",
                city: "Lyon",
                streetName: "Avenue Jean Jaurès",
                streetNumber: 123,
                price: 1800,
                area: 85,
                hasAC: false,
                yearConstruction: 1995,
                disponibilityDate: "2024-08-15",
                isFavorite: false,
                id: Date.now()
            },
        ];
        // Assigner un ID unique à chaque appartement s'il n'existe pas déjà
        const timestamp = Date.now();
        this.flats.forEach((flat, idx) => {
            if (!flat.id) flat.id = timestamp + idx; // Générer un ID unique via timestamp
        });
        this.initEventListeners();
        this.renderFlats();
    }

    initEventListeners() {
        document.getElementById("btn-new-apartment").addEventListener("click", () => {
            this.openModal("new-apartment-modal");
        });
        document.getElementById("btn-profile").addEventListener("click", () => {
            window.location.href = '/EASE-PROJECT/PAGES/profil.html';
        });
        document.querySelectorAll(".modal-close").forEach((btn) => {
            btn.addEventListener("click", () => {
                this.closeModal(btn.closest(".modal"));
            });
        });
        document.querySelectorAll(".modal").forEach((modal) => {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
        document.getElementById("new-apartment-form").addEventListener("submit", (e) => {
            e.preventDefault();
            this.addApartment(new FormData(e.target));
        });
        document.getElementById("edit-apartment-form").addEventListener("submit", (e) => {
            e.preventDefault();
            this.updateApartment(new FormData(e.target));
        });
        document.getElementById("sort-select").addEventListener("change", (e) => {
            this.sortFlats(e.target.value);
        });
        document.getElementById("search-input").addEventListener("input", (e) => {
            this.searchFlats(e.target.value);
        }); // Ajout écouteur pour recherche
        const flatsList = document.getElementById("flats-list");
        flatsList.addEventListener("click", (e) => {
            const button = e.target.closest("button");
            if (!button) return;
            const action = button.dataset.action;
            const id = parseInt(button.dataset.id);
            if (action === "favorite") {
                this.toggleFavorite(id);
            } else if (action === "edit") {
                this.editFlat(id);
            } else if (action === "delete") {
                this.deleteFlat(id);
            }
        });
    }

    openModal(modalClass) { // Correction: réinitialisation formulaire + erreurs
        const modal = document.querySelector(`.${modalClass}`);
        if (!modal) return;
        
        if (modalClass === "new-apartment-modal"){
            const form = modal.querySelector('form');
            if (form) form.reset()
        }
        // Effacer les messages d'erreur de validation existants
        modal.querySelectorAll('.validation-error').forEach(err => err.textContent = '');
        modal.removeAttribute("hidden");
        const firstInput = modal.querySelector("input, select, button");
        if (firstInput) firstInput.focus();
    }

    closeModal(modal) { // Fermeture du modale
        modal.setAttribute("hidden", true);
    }

    renderFlats(flatsToRender = this.flats) {
        const flatsListElement = document.getElementById("flats-list");
    
        // Vider la liste actuelle
        flatsListElement.innerHTML = "";
    
        // Afficher un message si aucun appartement
        if (flatsToRender.length === 0) {
            const emptyMessage = document.createElement("li");
            emptyMessage.textContent = "Aucun appartement trouvé";
            flatsListElement.appendChild(emptyMessage);
            return;
        }
    
        // Pour chaque appartement
        flatsToRender.forEach((flat, index) => {
            // Je crée l'élément li principal
            const flatItem = document.createElement("li");
            flatItem.className = "flat-item";
    
            // Détails de l'appartement
            const flatDetails = document.createElement("div");
            flatDetails.className = "flat-details";
    
            const title = document.createElement("strong");
            title.textContent = flat.name;
    
            const paragraph = document.createElement("p");
            paragraph.textContent =
                `${flat.streetNumber} ${flat.streetName}, ${flat.city} | ` +
                `${flat.price} €/mois | ${flat.area} m² | ` +
                `Construit en ${flat.yearConstruction} | ` +
                `Dispo. ${flat.disponibilityDate} | ` +
                `Clim. ${flat.hasAC ? "Oui" : "Non"} | `
    
            flatDetails.appendChild(title);
            flatDetails.appendChild(paragraph);
    
            // Boutons d'action
            const actionBtns = document.createElement("div");
            actionBtns.className = "action-btns";
    
            // Favori
            const favoriteBtn = document.createElement("button");
            favoriteBtn.className = "action-btn favorite-btn";
            if (flat.isFavorite) {
                favoriteBtn.classList.add("active");
            }
            favoriteBtn.setAttribute("data-action", "favorite");
            favoriteBtn.setAttribute("data-id", flat.id);
            favoriteBtn.setAttribute("aria-label", "Marquer comme favori");
            favoriteBtn.innerHTML = '<i class="fas fa-heart" aria-hidden="true"></i>';
    
            // Modifier
            const editBtn = document.createElement("button");
            editBtn.className = "action-btn edit-btn";
            editBtn.setAttribute("data-action", "edit");
            editBtn.setAttribute("data-id", flat.id);
            editBtn.setAttribute("aria-label", "Modifier");
            editBtn.innerHTML = '<i class="fas fa-edit" aria-hidden="true"></i>';
    
            // Supprimer
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "action-btn delete-btn";
            deleteBtn.setAttribute("data-action", "delete");
            deleteBtn.setAttribute("data-id", flat.id);
            deleteBtn.setAttribute("aria-label", "Supprimer");
            deleteBtn.innerHTML = '<i class="fas fa-trash" aria-hidden="true"></i>';
    
            // Ajout des boutons
            actionBtns.appendChild(favoriteBtn);
            actionBtns.appendChild(editBtn);
            actionBtns.appendChild(deleteBtn);
    
            // Assemblage des éléments
            flatItem.appendChild(flatDetails);
            flatItem.appendChild(actionBtns);
            flatsListElement.appendChild(flatItem);
        });
    
        // Sauvegarder dans le localStorage
        localStorage.setItem("appartements", JSON.stringify(this.flats));
    }
    

    validateForm(formData) {
        const validations = {
            name: (value) => value.trim() !== "",
            city: (value) => value.trim() !== "",
            streetName: (value) => value.trim() !== "",
            streetNumber: (value) => !isNaN(value) && parseInt(value) > 0,
            hasAC: (value) => value === "true" || value === "false",
            yearConstruction: (value) => {
                const year = parseInt(value);
                return !isNaN(year) && year >= 1800 && year <= 2025;
            },
            disponibilityDate: (value) => value !== "",
            price: (value) => !isNaN(value) && parseFloat(value) > 0,
            area: (value) => !isNaN(value) && parseFloat(value) >= 10,
        };
        let isValid = true;
        formData.forEach((value, key) => {
            const input = document.querySelector(`[name="${key}"]`);
            const errorElement = input.closest(".form-group").querySelector(".validation-error");
            if (!validations[key](value)) {
                errorElement.textContent = "Champ invalide";
                isValid = false;
            } else {
                errorElement.textContent = "";
            }
        });
        return isValid;
    }

    addApartment(formData) {
        if (!this.validateForm(formData)) return;
        const newFlat = {
            name: formData.get("name"),
            city: formData.get("city"),
            streetName: formData.get("streetName"),
            streetNumber: parseInt(formData.get("streetNumber")),
            price: parseFloat(formData.get("price")),
            area: parseFloat(formData.get("area")),
            hasAC: formData.get("hasAC") === "true",
            yearConstruction: parseInt(formData.get("yearConstruction")),
            disponibilityDate: formData.get("disponibilityDate"),
            isFavorite: true,
            id: Date.now() // Générer un ID unique via timestamp
        };
        this.flats.push(newFlat);
        this.renderFlats();
        document.getElementById("new-apartment-form").reset();
        this.closeModal(document.querySelector(".new-apartment-modal"));
    }

    editFlat(id) {
        id = parseInt(id);
        const flat = this.flats.find(f => f.id === id);
        if (!flat) return;
    
        const form = document.getElementById("edit-apartment-form");
    
        // Remplir chaque champ du formulaire avec les données de l'appartement
        form.querySelector("#edit-name").value = flat.name;
        form.querySelector("#edit-city").value = flat.city;
        form.querySelector("#edit-streetName").value = flat.streetName;
        form.querySelector("#edit-streetNumber").value = flat.streetNumber;
        form.querySelector("#edit-hasAC").value = flat.hasAC.toString(); // booléen -> "true"/"false"
        form.querySelector("#edit-yearConstruction").value = flat.yearConstruction;
        form.querySelector("#edit-disponibilityDate").value = flat.disponibilityDate;
        form.querySelector("#edit-price").value = flat.price;
        form.querySelector("#edit-area").value = flat.area;
    
        // Stocker l'id dans un attribut data-id du formulaire
        form.dataset.editId = id;
    
        // Afficher la modale
        this.openModal("edit-apartment-modal");
    }
    

    updateApartment(formData) {
        if (!this.validateForm(formData)) return;
        const editForm = document.getElementById("edit-apartment-form");
        const id = editForm.dataset.editId;
        const index = this.flats.findIndex(f => f.id === parseInt(id)); // Récupérer l'index correspondant à l'ID
        if (index === -1) return;
        const oldFlat = this.flats[index];
        this.flats[index] = {
            name: formData.get("name"),
            city: formData.get("city"),
            streetName: formData.get("streetName"),
            streetNumber: parseInt(formData.get("streetNumber")),
            price: parseFloat(formData.get("price")),
            area: parseFloat(formData.get("area")),
            hasAC: formData.get("hasAC") === "true",
            yearConstruction: parseInt(formData.get("yearConstruction")),
            disponibilityDate: formData.get("disponibilityDate"),
            isFavorite: oldFlat.isFavorite,
            id: oldFlat.id
        };
        this.renderFlats();
        this.closeModal(document.querySelector(".edit-apartment-modal"));
    }

    deleteFlat(id) {
        id = parseInt(id);
        const index = this.flats.findIndex(f => f.id === id); // Récupérer l'index correspondant à l'ID
        if (index === -1) return;
        if (confirm("Êtes-vous sûr de vouloir supprimer cet appartement ?")) {
            this.flats.splice(index, 1);
            this.renderFlats();
        }
    }

    toggleFavorite(id) {
        id = parseInt(id);
        const index = this.flats.findIndex(f => f.id === id); // Récupérer l'index correspondant à l'ID
        if (index === -1) return;
        this.flats[index].isFavorite = !this.flats[index].isFavorite;
        this.renderFlats();
    }

    sortFlats(criteria) {
        if (!criteria) {
            // Sans critère, on réaffiche la liste non triée originale
            return this.renderFlats();
        }
        const sortedFlats = [...this.flats].sort((a, b) => a[criteria] > b[criteria] ? 1 : -1);
        this.renderFlats(sortedFlats);
    }

    searchFlats(query) {
        query = query.toLowerCase();
        const filteredFlats = this.flats.filter((flat) =>
            Object.values(flat).toString().toLowerCase().includes(query)
        );
        this.renderFlats(filteredFlats);
    }
}

// Initialiser la gestion des appartements une fois le DOM chargé
document.addEventListener("DOMContentLoaded", () => {
    window.app = new ApartmentManager();
});
