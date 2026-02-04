const temaGuardado = localStorage.getItem("tema");
if (temaGuardado === "oscuro") {
  document.body.classList.add("dark");
}

//---------------------------------------------------------------------

function obtenerProyectos() {
  const data = localStorage.getItem("proyectos");
  return JSON.parse(data) || [];
}

//---------------------------------------------------------------------

function guardarProyectos(proyectos) {
  localStorage.setItem("proyectos", JSON.stringify(proyectos));
}

//---------------------------------------------------------------------

const root = document.getElementById("root");
const enlaces = document.querySelectorAll(".nav-link");
const contenido = {
  home: "<h1>Pagina de Inicio</h1>",
  proyectos: renderizarProyectos,
};

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

//---------------------------------------------------------------------

const navegar = async (ruta) => {
  const rutaLimpia = ruta.replace("#", "") || "home";

  if (typeof contenido[rutaLimpia] === "function") {
    await contenido[rutaLimpia]();
  } else {
    root.innerHTML = contenido[rutaLimpia];
  }
};

//---------------------------------------------------------------------

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
async function renderizarProyectos() {
  root.innerHTML = "";
  const formulario = crearFormulario();
  root.appendChild(formulario);

  if (localStorage.getItem("proyectos") !== null) {
    const dataAlmacenada = obtenerProyectos();
    root.appendChild(crearItems(dataAlmacenada));
  } else {
    const peticion = await fetch("https://jsonplaceholder.typicode.com/posts");
    const datos = await peticion.json();
    guardarProyectos(datos);
    root.appendChild(crearItems(datos));
  }

  function crearItems(datos) {
    const listaElementos = document.createElement("ul");
    datos.forEach(({ id, title }) => {
      const li = document.createElement("li");
      const boton = document.createElement("button");
      const titulo = document.createElement("span");
      titulo.textContent = title;
      boton.textContent = "X";
      li.appendChild(titulo);
      li.appendChild(boton);
      boton.addEventListener("click", () => {
        li.remove();
        const datosActuales = obtenerProyectos();
        const nuevosDatos = datosActuales.filter((p) => p.id !== id);
        guardarProyectos(nuevosDatos);
      });
      listaElementos.appendChild(li);
    });
    return listaElementos;
  }

  function crearFormulario() {
    const input = document.createElement("input");
    const boton = document.createElement("button");
    const div = document.createElement("div");
    boton.textContent = "Agregar";
    div.appendChild(input);
    div.appendChild(boton);

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        newDato(input);
      }
    });

    boton.addEventListener("click", (e) => {
      if (input.value !== "") {
        e.preventDefault();
        newDato(input);
      } else {
        alert("ESCRIBE ALGO SI QUIERES AGREGAR!");
      }
    });

    return div;
  }

  function newDato(input) {
    const nuevoPost = { id: Date.now(), title: input.value };
    const proyectos = obtenerProyectos();
    proyectos.push(nuevoPost);
    input.value = "";
    guardarProyectos(proyectos);
    actualizarLista();
  }

  function actualizarLista() {
    const datosActuales = obtenerProyectos();
    const listaExistente = root.querySelector("ul");
    if (listaExistente) {
      root.removeChild(listaExistente);
    }
    root.appendChild(crearItems(datosActuales));
  }
}
