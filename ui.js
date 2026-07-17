let contactSelectionne = null;
let contacts = [];
// Gestion des onglets
function showTab(id, event) {

    document
        .querySelectorAll(".tab-content")
        .forEach(el => el.classList.add("hidden"));

    document
        .getElementById(id)
        .classList.remove("hidden");

    if (id === "entree") {
        lancerScanner("entree");
    }

    if (id === "sortie") {
        lancerScanner("sortie");
    }

}

// Afficher QR Code
//function showQRSection() {
// document.getElementById("qrSection").classList.remove("hidden");
//}
// Afficher/Masquer les selects

function toggleMotif() {
  const choixFormation = document.getElementById("choix-formation");
  const choixVisite = document.getElementById("choix-visite");
 // const selectFormation = document.querySelector("#formation");
  //const selectVisite = document.querySelector("#visite");
  const motif = document.querySelector('input[name="motif"]:checked').value;

  if (motif === "formation") {
    choixFormation.classList.remove("hidden");
    choixVisite.classList.add("hidden");
  } else {
    choixFormation.classList.add("hidden");
    choixVisite.classList.remove("hidden");
  }
}

function printBadge() {
  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const formation = document.getElementById("formation");
  const visite = document.getElementById("visite").value;
  const motif = document.querySelector('input[name="motif"]:checked').value;

  const id = Number(visite);

  const contact = contacts.find((c) => c.id === id);

  document.getElementById("badge-nom").textContent = nom + " " + prenom;

  if (motif === "formation") {
    document.getElementById("badge-info").textContent =
      formation.options[formation.selectedIndex].text;

    document.getElementById("badge-local").textContent = "Local : 1.09";
  } else {
    document.getElementById("badge-info").textContent = contact.title.rendered;

    document.getElementById("badge-local").innerHTML =
      "Local : " + contact.acf.local + "<br>Tél : " + contact.acf.telephone;
  }

  document.getElementById("badge").classList.remove("hidden");

  window.print();

  document.getElementById("badge").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  showTab("entree");
});

// API WORDPRESS

// teste
/*fetch("https://ingrwf13.cepegra-frontend.xyz/wp_3/wp-json/wp/v2/formation")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });*/
