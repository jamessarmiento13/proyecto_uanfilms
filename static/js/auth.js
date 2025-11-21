document.addEventListener("DOMContentLoaded", () => {
    // Referencias al DOM
    const btnLogin = document.getElementById("btn-login");
    const btnCerrar = document.getElementById("btn-cerrar-login");
    const btnSubmit = document.getElementById("btn-submit-login");
    const btnLogout = document.getElementById("btn-logout");
    const popup = document.getElementById("popup-login");

    // 1. Evento: Abrir Popup
    if (btnLogin && popup) {
        btnLogin.addEventListener("click", () => {
            popup.style.display = "flex";
        });
    }

    // 2. Evento: Cerrar Popup
    if (btnCerrar && popup) {
        btnCerrar.addEventListener("click", () => {
            popup.style.display = "none";
        });
    }

    // 3. Evento: Enviar Login
    if (btnSubmit) {
        btnSubmit.addEventListener("click", iniciarSesion);
    }

    // 4. Evento: Cerrar Sesión
    if (btnLogout) {
        btnLogout.addEventListener("click", cerrarSesion);
    }

    // 5. Verificar usuario al cargar la página
    mostrarUsuario();

    // 6. Refrescar token cada 4 minutos
    setInterval(refrescarToken, 240000);
});

// ===============================
// FUNCIÓN: MOSTRAR/OCULTAR BOTONES
// ===============================
function mostrarUsuario() {
    const user = localStorage.getItem("username");

    const btnLogin = document.getElementById("btn-login");
    const divUsuario = document.getElementById("usuario-logueado");
    const spanUsername = document.getElementById("username");

    if (!btnLogin || !divUsuario) return;

    if (user) {
        btnLogin.style.display = "none";
        divUsuario.style.display = "flex";
        divUsuario.style.alignItems = "center";
        if (spanUsername) spanUsername.textContent = user;
    } else {
        btnLogin.style.display = "block";
        divUsuario.style.display = "none";
        if (spanUsername) spanUsername.textContent = "";
    }
}

// ===============================
// FUNCIÓN: INICIAR SESIÓN
// ===============================
async function iniciarSesion() {
    const userField = document.getElementById("login-username");
    const passField = document.getElementById("login-password");

    if (!userField || !passField) return;

    const username = userField.value;
    const password = passField.value;

    try {
        const res = await fetch("/api/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            alert("Credenciales incorrectas");
            return;
        }

        const data = await res.json();

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("username", username);

        alert("¡Bienvenido!");

        document.getElementById("popup-login").style.display = "none";
        userField.value = "";
        passField.value = "";

        mostrarUsuario();

    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión");
    }
}

// ===============================
// FUNCIÓN: CERRAR SESIÓN
// ===============================
function cerrarSesion() {
    if(confirm("¿Deseas cerrar sesión?")) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");

        mostrarUsuario();
    }
}

// ===============================
// FUNCIÓN: REFRESCAR TOKEN
// ===============================
async function refrescarToken() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return;

    try {
        const res = await fetch("/api/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh })
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem("access", data.access);
        } else {
            cerrarSesion();
        }
    } catch (error) {
        console.log("Error token:", error);
    }
}