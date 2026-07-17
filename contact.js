// Charger les contacts
const chargerContacts = () => {
  fetch(`${API_URL}/contacts`)
    .then((response) => response.json())
    .then((data) => {
      contacts = data;
      const select = document.getElementById("visite");

      for (const contact of data) {
        const option = document.createElement("option");

        option.value = contact.id;

        option.textContent = contact.title.rendered;

        select.appendChild(option);
      }
    });
};
const chargerInfosContact = () => {
  const id = document.getElementById("visite").value;

  fetch(`${API_URL}contacts/${id}`)
    .then((response) => response.json())
    .then((contact) => {

      contactSelectionne = contact;

      

    });
};

const recupererContactParId = async (id) => {

  const response = await fetch(`${API_URL}/contacts/${id}`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération du contact");
  }

  return await response.json();

};