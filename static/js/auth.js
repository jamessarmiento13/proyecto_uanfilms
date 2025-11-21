document.addEventListener("DOMContentLoaded", () => {
    // Referencias al DOM
    const btnLogin = document.getElementById("btn-login");
    const btnRegister = document.getElementById("btn-register");
    const btnCerrar = document.getElementById("btn-cerrar-login");
    const popup = document.getElementById("popup-login");
    
    const formTitle = document.getElementById("form-title");
    const loginFormContent = document.getElementById("login-form-content");
    const registerFormContent = document.getElementById("register-form-content");
    const btnToggleForm = document.getElementById("btn-toggle-form");

    // Inputs de Login
    const btnSubmitLogin = document.getElementById("btn-submit-login");
    const loginUsername = document.getElementById("login-username");
    const loginPassword = document.getElementById("login-password");
    
    // Inputs de Registro
    const btnSubmitRegister = document.getElementById("btn-submit-register");
    const registerUsername = document.getElementById("register-username");
    const registerEmail = document.getElementById("register-email");
    const registerPassword = document.getElementById("register-password");
    const registerPasswordConfirm = document.getElementById("register-password-confirm"); 

    // Referencias al Popup de Añadir Película
    const popupAddMovie = document.getElementById("popup-add-movie");
    const btnCerrarAddMovie = document.getElementById("btn-cerrar-add-movie");
    //const btnSubmitAddMovie = document.getElementById("btn-submit-add-movie"); 
    const addMovieFormTag = document.getElementById("add-movie-form-tag");

    // Referencias al botón Add Movie
    const btnAddMovie = document.getElementById("btn-add-movie");

    const btnLogout = document.getElementById("btn-logout");

    const API_BASE_URL = "/api";
    
   // ===============================
    // EVENTOS (AJUSTADOS)
    // ===============================

    // 1. Evento: Abrir Popup (Header - Iniciar Sesión): Abre en modo LOGIN
    if (btnLogin && popup) {
        btnLogin.addEventListener("click", () => {
            popup.style.display = "flex";
            toggleForm(false); // Abrir en modo Login
        });
    }
    
    // 2. Evento: Abrir Popup (Header - Registrarse): Abre en modo REGISTRO <--- NUEVO
    if (btnRegister && popup) {
        btnRegister.addEventListener("click", () => {
            popup.style.display = "flex";
            toggleForm(true); // Abrir en modo Registro
        });
    }
    
    // 3. Evento: Cerrar Popup
    if (btnCerrar && popup) {
        btnCerrar.addEventListener("click", () => {
            popup.style.display = "none";
        });
    }

    // 4. Evento: Enviar Login
    if (btnSubmitLogin) {
        btnSubmitLogin.addEventListener("click", iniciarSesion);
    }
    
    // 5. Evento: Enviar Registro
    if (btnSubmitRegister) {
        btnSubmitRegister.addEventListener("click", registrarUsuario);
    }
    
    // 6. Evento: Alternar formularios (Toggle dentro del popup)
    if (btnToggleForm) {
        btnToggleForm.addEventListener("click", () => {
            // Verifica si el formulario de registro está visible
            const isRegister = document.getElementById("register-form-content").style.display !== 'none';
            toggleForm(!isRegister); // Alterna al opuesto
        });
    }

    // 7. Evento: Cerrar Sesión
    if (btnLogout) {
        btnLogout.addEventListener("click", cerrarSesion);
    }
    
    // 8. Evento: Añadir Película (Manejador modificado) <--- ESTA FUNCIÓN DEBE ABRIR EL POPUP
    if (btnAddMovie) {
        // Cambiamos el manejador para que abra el popup, no redirija inmediatamente
        btnAddMovie.addEventListener("click", () => manejarBotonAddPelicula(popupAddMovie));
    }

    // 9. Evento: Cerrar Popup Añadir Película (NUEVO)
    if (btnCerrarAddMovie && popupAddMovie) {
        btnCerrarAddMovie.addEventListener("click", () => {
            popupAddMovie.style.display = "none";
        });
    }

    // 10. Evento: Enviar Formulario de Añadir Película (NUEVO)
    if (addMovieFormTag) {
    addMovieFormTag.addEventListener("submit", async (e) => {
        e.preventDefault();
        await agregarNuevaPelicula(); 
    });
}

    // 11. Verificar usuario al cargar la página
    mostrarUsuario();

    // 12. Refrescar token cada 4 minutos
    setInterval(refrescarToken, 240000);
});

// ===============================
// FUNCIÓN: ALTERNAR FORMULARIO
// ===============================
function toggleForm(showRegister) {
    const loginContent = document.getElementById("login-form-content");
    const registerContent = document.getElementById("register-form-content");
    const title = document.getElementById("form-title");
    const toggleButton = document.getElementById("btn-toggle-form");

    if (showRegister) {
        loginContent.style.display = 'none';
        registerContent.style.display = 'flex'; // Usamos 'flex'
        registerContent.style.flexDirection = 'column';
        title.textContent = 'Registrarse';
        toggleButton.textContent = '¿Ya tienes cuenta? Inicia Sesión';
    } else {
        loginContent.style.display = 'flex'; // Usamos 'flex'
        loginContent.style.flexDirection = 'column';
        registerContent.style.display = 'none';
        title.textContent = 'Iniciar Sesión';
        toggleButton.textContent = '¿No tienes cuenta? Regístrate';
    }
}

// ===============================
// FUNCIÓN: REGISTRAR USUARIO 
// ===============================
async function registrarUsuario() {
    const userField = document.getElementById("register-username");
    const emailField = document.getElementById("register-email");
    const passField1 = document.getElementById("register-password");
    // Usar el ID correcto definido en base.html:
    const passField2 = document.getElementById("register-password-confirm"); 

    if (!userField.value || !emailField.value || !passField1.value || !passField2.value) {
        alert("Todos los campos son obligatorios.");
        return;
    }
    
    if (passField1.value !== passField2.value) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    const userData = {
        username: userField.value,
        email: emailField.value,
        password: passField1.value,
        password2: passField2.value 
    };

    try {
        const res = await fetch("/api/register/", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const data = await res.json();

        if (res.ok) {
            alert("¡Registro exitoso! Por favor, inicia sesión.");
            toggleForm(false); // Cambiar al formulario de login
            // Limpiar campos
            userField.value = '';
            emailField.value = '';
            passField1.value = '';
            passField2.value = '';
        } else {
            const errorMessages = Object.values(data).flat().join('\n');
            alert(`Error al registrar usuario:\n${errorMessages}`);
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor.");
    }
}

// ===============================
// FUNCIÓN: AUTORIZACIÓN AÑADIR PELÍCULA
// ===============================
function manejarBotonAddPelicula(popupAddMovie) {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
        // Usuario logueado: Abrir el nuevo popup
        popupAddMovie.style.display = "flex";
    } else {
        // Usuario NO logueado: Muestra el popup de Login/Registro
        alert("Debes iniciar sesión para añadir una película.");
        const popupLogin = document.getElementById("popup-login");
        popupLogin.style.display = "flex";
        toggleForm(false); 
    }
}

// ===============================
// FUNCIÓN: AGREGAR NUEVA PELÍCULA
// ===============================
async function agregarNuevaPelicula() {
    const title = document.getElementById("add-movie-title").value;
    const sinopsis = document.getElementById("add-movie-sinopsis").value;
    const cast = document.getElementById("add-movie-cast").value; 
    const genre = document.getElementById("add-movie-genre").value;
    const yearValue = document.getElementById("add-movie-year").value;
    const posterUrl = document.getElementById("add-movie-poster-url").value;
    const director = document.getElementById("add-movie-director").value;
    
    const accessToken = localStorage.getItem("access");
    const yearInt = parseInt(yearValue); 

    if (!accessToken) {
        alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
        return;
    }

    if (!title || !sinopsis || !cast || !director || !genre || isNaN(yearInt) || yearInt <= 0) {
        // Mensaje de alerta actualizado
        alert("El Título, Sinopsis, Elenco, Director, Género, y un Año (numérico válido) son obligatorios.");
        return;
    }

    const movieData = {
        nombre: title, 
        sinopsis: sinopsis,
        elenco: cast, 
        director: director,
        genero: genre, 
        ano: yearInt,
     }

    try {
        const res = await fetch("/api/peliculas/", { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                //Añadir el token de autorización
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(movieData)
        });

        if (res.ok) {
            alert("¡Película agregada con éxito!");
            document.getElementById("popup-add-movie").style.display = "none";
            // Recargar la página o la lista de películas para ver el cambio
            window.location.reload(); 
        } else if (res.status === 401 || res.status === 403) {
             alert("No tienes permiso para realizar esta acción. Por favor, inicia sesión.");
        } else {
            const data = await res.json();
            const errorMessages = Object.values(data).flat().join('\n');
            alert(`Error al agregar película:\n${errorMessages}`);
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor.");
    }
}

// ===============================
// FUNCIÓN: MOSTRAR/OCULTAR BOTONES
// ===============================
function mostrarUsuario() {
    const user = localStorage.getItem("username");

    // Referencias a los contenedores del header (asumo que usaste estos IDs)
    const unloggedButtons = document.getElementById("auth-buttons-unlogged");
    const loggedButtons = document.getElementById("auth-buttons-logged");
    
    const divUsuario = document.getElementById("usuario-logueado");
    const spanUsername = document.getElementById("username");

    if (!unloggedButtons || !loggedButtons || !divUsuario) return;

    if (user) {
        // Usuario logueado: Oculta UNLOGGED, muestra LOGGED
        unloggedButtons.style.display = "none";
        loggedButtons.style.display = "flex"; // Usar flex para alinear
        divUsuario.style.display = "flex";
        if (spanUsername) spanUsername.textContent = user;
    } else {
        // Usuario NO logueado: Muestra UNLOGGED, oculta LOGGED
        unloggedButtons.style.display = "flex"; // Mostrar Iniciar Sesión y Registrarse
        loggedButtons.style.display = "none";
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