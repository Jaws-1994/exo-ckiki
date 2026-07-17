// Charger les formations
const chargerFormations = () => {
  fetch(`${API_URL}/formation`)
    .then((response) => response.json())
    .then((data) => {
      const select = document.getElementById("formation");

      for (const formation of data) {
        const option = document.createElement("option");

        option.value = formation.id;

        option.textContent = formation.title.rendered;

        select.appendChild(option);
      }
    });
};


const recupererFormationParId = async (id) => {

  const response = await fetch(`${API_URL}/formation/${id}`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la formation");
  }

  return await response.json();

};