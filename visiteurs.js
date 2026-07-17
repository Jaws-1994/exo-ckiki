const selectVisite = document.getElementById("visite");
selectVisite.addEventListener("change", chargerInfosContact);
const maintenant = new Date();
function dateEntree() {
  return new Date().toLocaleString("fr-BE");
}

function dateSortie() {
  return new Date().toLocaleString("fr-BE");
}
//fonction recup visiteurs

const recupererVisiteurs = async () => {
  const response = await fetch(`${API_URL}/visiteurs?per_page=100`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des visiteurs");
  }

  return await response.json();
};

async function verifierDoublon(nom, prenom, email) {

    try {

        const response = await fetch(`${API_URL}/visiteurs?per_page=100`);

        const visiteurs = await response.json();

      


        const doublon = visiteurs.find(visiteur => {

            const acf = visiteur.acf;


            return (
                acf.visiteur_nom.toLowerCase() === nom.toLowerCase() &&
                acf.visiteur_prenom.toLowerCase() === prenom.toLowerCase() &&
                acf.visiteur_email.toLowerCase() === email.toLowerCase() &&
                !acf.date_sortie_visiteur
            );

        });


        return doublon !== undefined;


    } catch(error) {

        console.error("Erreur vérification doublon :", error);

        return false;
    }
}

// ajouter visiteurs
const ajouterVisiteur = async () => {


  // 1. Récupération des données
  const nom = document.querySelector("#nom").value;
  const prenom = document.querySelector("#prenom").value;
  const email = document.querySelector("#email").value;
  const motif = document.querySelector('input[name="motif"]:checked').value;
  const forma = document.querySelector("#formation").value;
  const personnel = document.querySelector("#visite").value;

  const existe = await verifierDoublon(
    nom,
    prenom,
    email
);


if(existe){

    alert("Ce visiteur existe déjà dans le système.");

    return;
}

  // Validation
  if (motif === "formation" && !forma) {
    alert("Veuillez sélectionner une formation.");
    return;
  }

  if (motif === "visite" && !personnel) {
    alert("Veuillez sélectionner un membre du personnel.");
    return;
  }
  // ----------------------------------------------------
  // 2. Création des données ACF
  const acf = {
    visiteur_nom: nom,
    visiteur_prenom: prenom,
    visiteur_email: email,
    motif_de_la_visite: motif,
    date_entree_visiteurs: dateEntree(),
  };

  if (motif === "formation") {
    acf.formations = [Number(forma)];
  }

  if (motif === "visite") {
    acf.personnel = [Number(personnel)];
  }

  // 3. Création du body
  const body = {
    title: `${prenom} ${nom}`,
    status: "publish",
    acf: acf,
  };

  console.log(JSON.stringify(body, null, 2));

  // 4. Envoi à WordPress
  try {
    const resp = await fetch(`${API_URL}/visiteurs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();


    if (!resp.ok) {
      throw new Error(resp.status);
    }
    genererQRCode(data.id);

    printBadge();
    alert("Visiteur ajouté !");

    await afficherVisiteursPresents();
    await afficherHistorique();
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'ajout.");
  }
};

// recherche des visiteurs dans la DB
const rechercherVisiteur = async () => {
  const email = document.getElementById("email-enter").value;

  const visiteurs = await recupererVisiteurs();

  const visiteur = visiteurs.find((v) => v.acf.visiteur_email === email);


  if (!visiteur) {
    alert("Aucun visiteur trouvé avec cet email.");
    return;
  }

  // condition si on trouve le visiteur , remplacement des inputs par les donnèes connues

  if (visiteur) {
    document.getElementById("nom").value = visiteur.acf.visiteur_nom;

    document.getElementById("prenom").value = visiteur.acf.visiteur_prenom;

    document.getElementById("email").value = visiteur.acf.visiteur_email;
  } else {
    alert("Aucun visiteur trouvé.");
  }
};
document
  .getElementById("btn-rechercher")
  .addEventListener("click", rechercherVisiteur);
  
  const rechercherParId = async () => {

    const id = Number(
        document.getElementById("id-enter").value
    );

    const visiteurs = await recupererVisiteurs();

    const visiteur =
        visiteurs.find(v => v.id === id);

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

};

// SORTIE VISITEUR

// fonction pour la validation de la sortie du visiteur
const sortieVisiteur = async () => {
  const email = document.getElementById("email-sortie").value;

  // Recherche du visiteur
  const visiteurs = await recupererVisiteurs();

  const visiteur = visiteurs.find((v) => v.acf.visiteur_email === email);

  if (!visiteur) {
    alert("Aucun visiteur trouvé avec cet email.");
    return;
  }



  // Body envoyé à WordPress
  const body = {
    acf: {
      visiteur_nom: visiteur.acf.visiteur_nom,
      visiteur_prenom: visiteur.acf.visiteur_prenom,
      visiteur_email: visiteur.acf.visiteur_email,
      motif_de_la_visite: visiteur.acf.motif_de_la_visite.value,
      date_sortie_visiteur: dateSortie(),

      ...(visiteur.acf.motif_de_la_visite.value === "formation" && {
        formations: [visiteur.acf.formations[0].ID],
      }),

      ...(visiteur.acf.motif_de_la_visite.value === "visite" && {
        personnel: [visiteur.acf.personnel[0].ID],
      }),
    },
  };

 

  // Mise à jour du visiteur
  const responseUpdate = await fetch(`${API_URL}/visiteurs/${visiteur.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(body),
  });

  const resultat = await responseUpdate.json();


  if (responseUpdate.ok) {
    alert("Sortie enregistrée avec succès !");

    document.getElementById("email-sortie").value = "";

    await afficherVisiteursPresents();
    await afficherHistorique();
  } else {
    alert("Erreur lors de la mise à jour.");
  }
};

// fonction affichage des visteurs dans le batiments
const afficherVisiteursPresents = async () => {
  const visiteurs = await recupererVisiteurs();

  const presents = visiteurs.filter(
    (visiteur) => !visiteur.acf.date_sortie_visiteur,
  );

  const tbody = document.getElementById("table-presents");

  tbody.innerHTML = "";

  const recherche = document
    .getElementById("recherche-present")
    .value.toLowerCase();
  for (const visiteur of presents) {
    const texte = (
      visiteur.acf.visiteur_nom +
      " " +
      visiteur.acf.visiteur_prenom +
      " " +
      visiteur.acf.visiteur_email
    ).toLowerCase();

    if (!texte.includes(recherche)) {
      continue;
    }
    let detail = "";
    let local = "";
    let telephone = "";

    if (visiteur.acf.motif_de_la_visite.value === "visite") {
      const contact = await recupererContactParId(visiteur.acf.personnel[0].ID);
      detail = contact.title.rendered;
      local = contact.acf.local;
      telephone = contact.acf.telephone;
    } else {
      const formation = visiteur.acf.formations[0];

      detail = formation.post_title;
      local = "1.09";
      telephone = "-";
    }
    const ligne = document.createElement("tr");
    let badge = "";

    if (visiteur.acf.motif_de_la_visite.value === "visite") {
      badge = '<span class="badge-visite">Visite</span>';
    } else {
      badge = '<span class="badge-formation">Formation</span>';
    }

    ligne.innerHTML = `
            <td>${visiteur.acf.visiteur_nom}</td>
            <td>${visiteur.acf.visiteur_prenom}</td>
            <td>${visiteur.acf.visiteur_email}</td>
            <td>${badge}</td>
            <td>${detail}</td>
            <td>${local}</td>
            <td>${telephone}</td>
           <td>${visiteur.acf.date_entree_visiteurs || "-"}</td>
        `;

    tbody.appendChild(ligne);
  }
};

// fonction affichage de l historique
const afficherHistorique = async () => {

  const visiteurs = await recupererVisiteurs();

  const historique = visiteurs.filter(
    visiteur => visiteur.acf.date_sortie_visiteur
  );

  const tbody = document.getElementById("table-historique");

  tbody.innerHTML = "";

  // Date choisie dans le filtre
  const dateRecherche = document.getElementById("date-historique").value;

  for (const visiteur of historique) {
    // Filtre par date
  
    if (dateRecherche !== "") {

      // Exemple :
      // 16/07/2026 10:32:15
      const dateFr = visiteur.acf.date_entree_visiteurs.split(" ")[0];

      const morceaux = dateFr.split("/");

      // Devient :
      // 2026-07-16
      const dateVisiteur =
        `${morceaux[2]}-${morceaux[1]}-${morceaux[0]}`;

      if (dateVisiteur !== dateRecherche) {
        continue;
      }

    }

    const ligne = document.createElement("tr");

    ligne.innerHTML = `
      <td>${visiteur.acf.visiteur_nom}</td>
      <td>${visiteur.acf.visiteur_prenom}</td>
      <td>${visiteur.acf.visiteur_email}</td>
      <td>${visiteur.acf.motif_de_la_visite.label}</td>
      <td>${visiteur.acf.date_entree_visiteurs || "-"}</td>
      <td>${visiteur.acf.date_sortie_visiteur || "-"}</td>
    `;

    tbody.appendChild(ligne);

  }

};

document
  .getElementById("recherche-present")
  .addEventListener("input", afficherVisiteursPresents);



  const exporterCSV = async () => {

    const visiteurs = await recupererVisiteurs();

    const historique = visiteurs.filter(
        visiteur => visiteur.acf.date_sortie_visiteur
    );

    const dateRecherche =
        document.getElementById("date-historique").value;

    let csv =
        "Nom;Prénom;Email;Motif;Entrée;Sortie\n";

    for (const visiteur of historique) {

        if (dateRecherche !== "") {

            const dateFr =
                visiteur.acf.date_entree_visiteurs.split(" ")[0];

            const morceaux =
                dateFr.split("/");

            const dateVisiteur =
                `${morceaux[2]}-${morceaux[1]}-${morceaux[0]}`;

            if (dateVisiteur !== dateRecherche) {
                continue;
            }

        }

        csv +=
`${visiteur.acf.visiteur_nom};${visiteur.acf.visiteur_prenom};${visiteur.acf.visiteur_email};${visiteur.acf.motif_de_la_visite.label};${visiteur.acf.date_entree_visiteurs};${visiteur.acf.date_sortie_visiteur}\n`;

    }

    const blob = new Blob(
        [csv],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const url =
        URL.createObjectURL(blob);

    const lien =
        document.createElement("a");

    lien.href = url;

    lien.download = "historique_visiteurs.csv";

    document.body.appendChild(lien);

    lien.click();

    document.body.removeChild(lien);

    URL.revokeObjectURL(url);

};

document
  .getElementById("recherche-present")
  .addEventListener("input", afficherVisiteursPresents);


afficherVisiteursPresents();
afficherHistorique();
