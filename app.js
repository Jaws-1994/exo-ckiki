// Chargement des données
chargerFormations();
chargerContacts();


//const role = localStorage.getItem("role");

//if (role === "administrator") {
  //  document.getElementById("btn-admin").classList.remove("hidden");
//}


// Initialisation de l'application
document.addEventListener("DOMContentLoaded", () => {

    // Formulaire d'entrée
    document
        .getElementById("form-entree")
        .addEventListener("submit", (event) => {
            event.preventDefault();
            ajouterVisiteur();
        });

    // Recherche par email
    document
        .getElementById("btn-rechercher")
        .addEventListener("click", rechercherVisiteur);

    // Validation sortie
    document
        .getElementById("btn-sortie")
        .addEventListener("click", sortieVisiteur);

    // Infos contact
    document
        .getElementById("visite")
        .addEventListener("change", chargerInfosContact);

    // Rafraîchir la liste
    document
        .getElementById("btn-refresh")
        .addEventListener("click", afficherVisiteursPresents);

    // Déconnexion
    document
        .getElementById("logout")
        .addEventListener("click", () => {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "login.html";

        });

});
// recherche par date dans l'historique des visites
document
    .getElementById("btn-recherche-date")
    .addEventListener("click", afficherHistorique);

document
    .getElementById("btn-reset-date")
    .addEventListener("click", () => {

        document.getElementById("date-historique").value = "";

        afficherHistorique();

    });
// recherche par ID
document
    .getElementById("btn-id")
    .addEventListener("click", rechercherParId);


// export csv
    document
    .getElementById("btn-export-csv")
    .addEventListener("click", exporterCSV);

    // L'application démarre sur l'onglet Entrée
showTab("entree");

// Lance automatiquement le scanner d'entrée
lancerScanner("entree");