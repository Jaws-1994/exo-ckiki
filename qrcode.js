let scanner = null;
let scannerEnCours = false;
let modeScanner = "";

// Génération du QR Code du badge
const genererQRCode = (idVisiteur) => {
  const zoneQR = document.getElementById("qrcode");

  zoneQR.innerHTML = "";

  new QRCode(zoneQR, {
    text: idVisiteur.toString(),
    width: 120,
    height: 120,
  });
};

// Démarrage du scanner

const lancerScanner = async (mode) => {
  if (scannerEnCours) {
    return;
  }

  modeScanner = mode;

  const reader = mode === "entree" ? "reader-entree" : "reader-sortie";

  scanner = new Html5Qrcode(reader);

  scannerEnCours = true;

  try {
    await scanner.start(
      {
        facingMode: "environment",
      },
      {
        fps: 10,
        qrbox: 250,
      },
      onScanSuccess
    );
  } catch (err) {
    console.error(err);

    scannerEnCours = false;
  }
};

// Arrêt du scanner

const arreterScanner = async () => {
  if (!scannerEnCours || !scanner) {
    return;
  }

  try {
    await scanner.stop();

    await scanner.clear();
  } catch (err) {
    console.error(err);
  }

  scanner = null;

  scannerEnCours = false;
};
// le gestion du scan
const onScanSuccess = async (decodedText) => {

    // On évite plusieurs lectures du même QR
    await arreterScanner();

    const idVisiteur = Number(decodedText);

    

    if (modeScanner === "entree") {

        await traiterEntree(idVisiteur);

    }

    if (modeScanner === "sortie") {

        await traiterSortie(idVisiteur);

    }

};

const traiterEntree = async (idVisiteur) => {

    const visiteurs = await recupererVisiteurs();

    const visiteur = visiteurs.find(v => v.id === idVisiteur);

    if (!visiteur) {

        alert("Visiteur introuvable.");

        return;

    }

    document.getElementById("nom").value =
        visiteur.acf.visiteur_nom;

    document.getElementById("prenom").value =
        visiteur.acf.visiteur_prenom;

    document.getElementById("email").value =
        visiteur.acf.visiteur_email;

    // On pourra compléter automatiquement
    // Formation / Personnel juste après.
    // Réinitialise le choix du motif
document
  .querySelectorAll('input[name="motif"]')
  .forEach(radio => radio.checked = false);

// Cache les listes
document.getElementById("choix-formation").classList.add("hidden");
document.getElementById("choix-visite").classList.add("hidden");

// Vide les sélections
document.getElementById("formation").value = "";
document.getElementById("visite").value = "";

    alert("Visiteur retrouvé.");

};

const traiterSortie = async (idVisiteur) => {

    const visiteurs = await recupererVisiteurs();

    const visiteur = visiteurs.find(v => v.id === idVisiteur);

    if (!visiteur) {

        alert("Visiteur introuvable.");

        return;

    }

    const acf = {

        visiteur_nom: visiteur.acf.visiteur_nom,

        visiteur_prenom: visiteur.acf.visiteur_prenom,

        visiteur_email: visiteur.acf.visiteur_email,

        motif_de_la_visite:
            visiteur.acf.motif_de_la_visite.value,

        date_sortie_visiteur: dateSortie()

    };

    if (visiteur.acf.motif_de_la_visite.value === "formation") {

        acf.formations = [
            visiteur.acf.formations[0].ID
        ];

    }

    if (visiteur.acf.motif_de_la_visite.value === "visite") {

        acf.personnel = [
            visiteur.acf.personnel[0].ID
        ];

    }

    const response = await fetch(

        `${API_URL}/visiteurs/${visiteur.id}`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization:
                    `Bearer ${localStorage.getItem("token")}`

            },

            body: JSON.stringify({

                acf: acf

            })

        }

    );

    if (!response.ok) {

        alert("Erreur lors de la sortie.");

        return;

    }

    alert("Sortie enregistrée.");

    await afficherVisiteursPresents();

    await afficherHistorique();

};