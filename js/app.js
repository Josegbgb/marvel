let personajesData = [];
let seriesData = [];
let datos = [];

function fetchMarvelAPI(url, callback) {
  return fetch(url)
    .then((res) => res.json())
    .then((json) => callback(json.data.results));
}

function cargarDatosIniciales() {
  const URLAPI =
    "https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=93afdc34382fb5abf6fc43af3098e4ba&hash=296ec1a1283dca8e8d5798dd6ca0b620";
  const URLAPISERIE =
    "https://gateway.marvel.com:443/v1/public/series?ts=1&apikey=93afdc34382fb5abf6fc43af3098e4ba&hash=296ec1a1283dca8e8d5798dd6ca0b620";

  fetchMarvelAPI(URLAPI, (results) => {
    personajesData = results;
    console.log("Personajes cargados:", personajesData);
  });

  fetchMarvelAPI(URLAPISERIE, (results) => {
    seriesData = results;
    console.log("Series cargadas:", seriesData);
    datos = [...personajesData, ...seriesData];
  });
}

function crearCarta(variable, contentHTML, container) {
  for (const seccion of variable) {
    let url_seccion = seccion.urls[0].url;
    contentHTML += `
            <div class="col-md-4">
              <a href="${url_seccion}" target="_blank">
              <img src="${
                seccion.thumbnail.path.includes("image_not_available")
                  ? "generica"
                  : seccion.thumbnail.path
              }.${
      seccion.thumbnail.path.includes("image_not_available")
        ? "png"
        : seccion.thumbnail.extension
    }" alt="${seccion.name}" class="img-thumbnail">
               </a>
               <h3 class="tittle">${
                 variable[0].name === undefined ? seccion.title : seccion.name
               }</h3>
           </div>`;
  }
  container.innerHTML = contentHTML;
}

const marvel = {
  render: () => {
    const container = document.querySelector("#marvel-row");
    let contentHTML = "";
    if (personajesData.length === 0) {
      setTimeout(() => {
        crearCarta(personajesData, contentHTML, container);
      }, 2000);
    }
    crearCarta(personajesData, contentHTML, container);
  },
};

const marvelSeries = {
  render: () => {
    const container = document.querySelector("#marvel-row-serie");
    let contentHTML = "";
    if (seriesData.length === 0) {
      setTimeout(() => {
        crearCarta(seriesData, contentHTML, container);
      }, 2000);
    }
    crearCarta(seriesData, contentHTML, container);
  },
};

// variables SPA
let body = document.body.innerHTML;
let registrarse = `
<section class="section-login">
  <nav class="nav-login">
       <img src="m.png" class="enlace" id="logo" data-attribute="index"/>
  </nav>
  <div>
    <form action="" method="post" id="registro">

  <label for="usuario">Nombre y apellido</label>
  
  <input type="text" id="usuario">
  
  <label for="correo">Correo electronico</label>
  
  <input type="email" id="correo">
  

  <label for="contraseña">Contraseña</label>

  <input type="password" id="contraseña">

  <br>
  <p class="usuario-error">El correo electronico ya se encuentra registrado</p>
  <p class="campos-error">Completa todos los campos</p>
  <button type="button" onclick="registrarUsuario()" id="enviar">Registrarse</button>
  </form>
  </div>
  

</section>

`;
let login = `



<section class="section-login">
<nav>
<img src="m.png" class="enlace" id="logo" data-attribute="index"/>

</nav>
  <div>
    <form action="" method="post" id="registro">
    
    <p><label for="correo">Correo electronico</label></p>
    
    <input type="email" id="correoLogin">

    <p><label for="contraseña">Contraseña</label></p>

    <input type="password" id="contraseñaLogin">

    <br>
    <p class="usuario-error">Usuario no encontrado</p>
    <label onclick="iniciarSesion()" id="enviar">Iniciar Sesion</label>
    </form>
  </div>
    
    </section>
`;
let personajePage = `
  <section class="spa">
    <nav class="nav-login">
      <img src="m.png" class="enlace" id="logo" data-attribute="index"/>
    </nav>
    <div class="paginas-spa">
      <h1>Personajes destacados</h1>
      <div class="container">
        <div class="row" id="marvel-row"></div>
      </div>
    </div>
  </section>
`;
let historietaPage = `
  <section class="spa">
    <nav class="nav-login">
      <img src="m.png" class="enlace" id="logo" data-attribute="index"/>
    </nav>
    <div class="paginas-spa">
      <h1>Historietas destacadas</h1>
      <div class="container">
        <div class="row" id="marvel-row-serie"></div>
      </div>
    </div>
  </section>
`;
// fin variables SPA

//registrar usuario
function registrarUsuario() {
  const campos_error = document.querySelector(".campos-error");
  const mensaje_error = document.querySelector(".usuario-error");

  if ($("#usuario").val() && $("#correo").val() && $("#contraseña").val()) {
    let lista = JSON.parse(localStorage.getItem("Personas")) || [];
    const lista_filtrado = lista.filter((elemento) => {
      return elemento._correo.includes($("#correo").val().toLowerCase());
    });

    if (lista_filtrado.length === 0) {
      const persona1 = new Persona(
        $("#usuario").val(),
        $("#correo").val().toLowerCase(),
        $("#contraseña").val()
      );
      lista.push(persona1);
      localStorage.setItem("Personas", JSON.stringify(lista));
      location.reload();
    } else {
      campos_error.style.display = "none";
      mensaje_error.style.display = "block";
    }
  } else {
    mensaje_error.style.display = "none";
    campos_error.style.display = "block";
  }
}
// fin registrar usuario

// inicia sesion
function iniciarSesion() {
  let lista = JSON.parse(localStorage.getItem("Personas"));
  const correo_login = $("#correoLogin").val();
  const contraseña = $("#contraseñaLogin").val();

  const buscarCorreo = lista.find((correo) => {
    return correo._correo === correo_login;
  });
  console.log(buscarCorreo);
  if (buscarCorreo === undefined) {
    const mensaje_error = document.querySelector(".usuario-error");
    mensaje_error.style.display = "block";
  } else if (
    buscarCorreo._correo === correo_login &&
    buscarCorreo._contraseña === contraseña
  ) {
    let sesion = sessionStorage.setItem(
      "Usuario",
      JSON.stringify(buscarCorreo)
    );
    location.reload();
  }
}
// fin inicia sesion

if (sessionStorage.getItem("Usuario") != null) {
  const padre_ul = document.querySelector("#padre");
  const boton_iniciarSesion = padre_ul.children[3];
  const nuevo_li = document.createElement("li");
  const text = document.createTextNode("Cerrar sesion");
  nuevo_li.setAttribute("id", "logOut");
  nuevo_li.appendChild(text);
  padre_ul.replaceChild(nuevo_li, boton_iniciarSesion);
  const boton_registrarse = document.querySelector("#singUp");
  padre_ul.removeChild(boton_registrarse);
  const nombre = document.createElement("li");
  const text_nombre = document.createTextNode("Bienvenido ");
  const span_nombre = document.createElement("span");
  span_nombre.textContent = `${
    JSON.parse(sessionStorage.getItem("Usuario"))._username
  }`;
  nombre.appendChild(text_nombre);
  nombre.appendChild(span_nombre);
  padre_ul.appendChild(nombre);
}

$("#logOut").on("click", () => {
  sessionStorage.clear();
  history.go(0);
});

document.addEventListener("DOMContentLoaded", () => {
  cargarDatosIniciales();

  function goToRoute(url) {
    switch (url) {
      case "personajes":
        $("body").html(personajePage);
        marvel.render();
        break;
      case "historietas":
        $("body").html(historietaPage);
        marvelSeries.render();
        break;
      case "registrarse":
        $("body").html(registrarse);
        break;
      case "Iniciar sesion":
        $("body").html(login);
        break;
      case "index":
        $("body").html(body);
        break;
    }
  }
  $(document).on("click", ".enlace", (e) => {
    const path = e.target.getAttribute("data-attribute");
    if (path) {
      console.log(e.target); // Esto ahora funcionará correctamente
      goToRoute(path);
    }
  });
});

document.addEventListener("keyup", (e) => {
  if (!e.target.matches("#buscador")) return;

  let solicitud = e.target.value.trim().toLowerCase();
  const nombres = datos.filter(
    (elemento) =>
      (elemento.name && elemento.name.toLowerCase().includes(solicitud)) ||
      (elemento.title && elemento.title.toLowerCase().includes(solicitud))
  );

  let ul = document.querySelector(".list-group");
  if (solicitud === "") {
    ul.innerHTML = "";
    return;
  }

  ul.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    if (!nombres[i]) continue;
    let a = document.createElement("a");
    let li = document.createElement("li");
    const text = document.createTextNode(nombres[i].name || nombres[i].title);
    a.appendChild(li);
    li.appendChild(text);
    li.setAttribute("class", "list-group-item");
    a.setAttribute("href", nombres[i].urls[0].url || nombres[i].urls[0].url);
    ul.appendChild(a);
  }
});
