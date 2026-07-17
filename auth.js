async function connexion(event) {

    event.preventDefault();

    const username = document.getElementById("login").value;
    const password = document.getElementById("password").value;

     const response = await fetch(
        "https://ingrwf13.cepegra-frontend.xyz/wp_3/wp-json/jwt-auth/v1/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        }
    );

    const data = await response.json();

  if (response.ok) {

    localStorage.setItem("token", data.token);
    const me = await fetch(
    "https://ingrwf13.cepegra-frontend.xyz/wp_3/wp-json/wp/v2/users/me",
    {
        headers: {
            Authorization: `Bearer ${data.token}`
        }
    }
);

const user = await me.json();


    localStorage.setItem("user", data.user_display_name);

    window.location.href = "index.html";

} else {

    document.getElementById("erreur").textContent =
        "Login ou mot de passe incorrect.";

}

}
document
    .getElementById("login-form")
    .addEventListener("submit", connexion);