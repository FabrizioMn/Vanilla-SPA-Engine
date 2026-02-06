const temaGuardado = localStorage.getItem("tema");
if (temaGuardado === "oscuro") {
  document.body.classList.add("dark");
}


//---------------------------------------------------------------------
// lOGICA DE NAVEGACION
//---------------------------------------------------------------------
const root = document.getElementById("root");
const enlaces = document.querySelectorAll(".nav-link");
const contenido = {
  home: "<h1>Pagina de Inicio</h1>",
  proyectos: renderizarPeliculas,
};

const navegar = async (ruta) => {
  const rutaLimpia = ruta.replace("#", "") || "home";
  if (typeof contenido[rutaLimpia] === "function") {
    await contenido[rutaLimpia]();
  } else {
    root.innerHTML = contenido[rutaLimpia];
  }
};

enlaces.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    history.pushState({}, "", "/#" + link.dataset.route);
    navegar(link.dataset.route);
  });
});

window.addEventListener("popstate", () => {
  navegar(location.hash);
});

navegar(location.hash);

//---------------------------------------------------------------------
//MODO OSCURO
//---------------------------------------------------------------------
const boton = document.createElement("button");
const navBar = document.getElementById("nav");
boton.textContent = "Cambiar modo🌑";
nav.appendChild(boton);
boton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("tema", isDark ? "oscuro" : "claro");
  if (
    isDark
      ? (boton.textContent = "Modo Claro ☀")
      : (boton.textContent = "Modo Oscuro 🌑")
  );
});

//-------------------------------------------------------------
//SEGUNDO PROYECTO TRABAJAMDO CON DATOS REALES
//-------------------------------------------------------------

const API_KEY ="";

let paginaActual = 1;

async function renderizarPeliculas() {
  root.innerHTML = "";
  paginaActual = 1;
  crearFormulario();
  await obtenerPeliculas();
  const boton = document.createElement("button");
  boton.textContent = "Cargar Mas";
  boton.id="btnCargar";
  root.appendChild(boton);
  boton.addEventListener("click", async () => {
    paginaActual += 1;
    const input = root.querySelector("input");
    
    if (input.value) {
      const URL_SEARCH = `https://api.themoviedb.org/3/search/movie?query=${input.value}&include_adult=false&language=es-ES&page=${paginaActual}`;
      const listaActual = root.querySelector("ul");
      const data = await pedirDatos(URL_SEARCH);
      pintarPeliculas(data.results, listaActual);
    } else {
      obtenerPeliculas();
    }
  });
}

async function obtenerPeliculas() {
  let listaPeliculas = root.querySelector("ul");
  if (!listaPeliculas) {
    listaPeliculas = document.createElement("ul");
    root.appendChild(listaPeliculas);
  }

  let URL_BASE = `https://api.themoviedb.org/3/movie/popular?language=es-ES&page=${paginaActual}`;

  try {
    const datos = await pedirDatos(URL_BASE);
    pintarPeliculas(datos.results, listaPeliculas);
    controlarBoton(datos);
  } catch (e) {
    console.log("Error al traer las peliculas:", e);
  }
}

function pintarPeliculas(datos, lista) {
  try {
    datos.forEach(({ title, poster_path }) => {
      const li = document.createElement("li");
      const titulo = document.createElement("h3");
      const imagen = document.createElement("img");
      titulo.textContent = title;
      imagen.src = poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : `https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg`;
      li.appendChild(imagen);
      li.appendChild(titulo);
      lista.appendChild(li);
    });
  } catch (e) {
    console.log("Error al mostrar las peliculas", e);
  }
}

function crearFormulario() {
  const div = document.createElement("div");
  const boton = document.createElement("button");
  const input = document.createElement("input");
  boton.textContent = "Buscar";
  div.appendChild(input);
  div.appendChild(boton);

  boton.addEventListener("click", async () => {
    paginaActual=1;
    const URL_SEARCH = `https://api.themoviedb.org/3/search/movie?query=${input.value}&include_adult=false&language=es-ES`;
    const listaActual = root.querySelector("ul");
    if (!listaActual) {
      listaActual = document.createElement("ul");
      root.appendChild(listaActual);
    }
    listaActual.innerHTML = "";

    const data = await pedirDatos(URL_SEARCH);

    if(data.results.length===0){
      controlarBoton(data);
      listaActual.style.gridTemplateColumns="none"
      listaActual.innerHTML=`<h1>No se encontraron resultados</h1>`;
      return;
    }

    pintarPeliculas(data.results, listaActual);
    controlarBoton(data);

  });
  root.appendChild(div);
}

function controlarBoton(data){
  const btn=document.getElementById("btnCargar");
  if(data.page < data.total_pages){
    btn.style.display="block";
  } else{
    btn.style.display="none";
  }
}

async function pedirDatos(url) {
  const opciones = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };
  const res = await fetch(url, opciones);
  return await res.json();
}
