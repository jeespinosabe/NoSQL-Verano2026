const formulario = document.getElementById("formulario");

const titulo = document.getElementById("titulo");
const genero = document.getElementById("genero");
const año = document.getElementById("año");
const duracion = document.getElementById("duracion");
const idioma = document.getElementById("idioma");
const calificacion = document.getElementById("calificacion");

const btnConsultar = document.getElementById("btnConsultar");
const listaPeliculas = document.getElementById("listaPeliculas");

// Guardar película
formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const pelicula = {
        titulo: titulo.value,
        genero: genero.value,
        año: Number(año.value),
        duracion: Number(duracion.value),
        idioma: idioma.value,
        calificacion: Number(calificacion.value)
    };

    try {

        const respuesta = await agregarPelicula(pelicula);

        alert(respuesta.mensaje);

        formulario.reset();

    } catch (error) {

        alert(error.message);

    }

});

// Consultar películas
btnConsultar.addEventListener("click", async () => {

    try {

        const peliculas = await obtenerPeliculas();

        listaPeliculas.innerHTML = "";

        peliculas.forEach((pelicula) => {

            const li = document.createElement("li");

            li.textContent = pelicula.titulo;

            listaPeliculas.appendChild(li);

        });

    } catch (error) {

        alert(error.message);

    }

});