const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//la conexion a la bd
mongoose.connect("mongodb+srv://grupo:grupo@servidorprueba.ygegryf.mongodb.net/netflix")
	.then(() => {
		console.log("Conectado correctamente a MongoDB");
	})
	.catch((error) => {
		console.log("Error al conectar a MongoDB:", error);
	});

//prueba
app.get("/", (req, res) => {
	res.send("API de Netflix funcionando");
});

app.listen(port, () => {
	console.log(`Servidor iniciado en http://localhost:${port}`);
});

//esquema
const peliculaSchema = new mongoose.Schema(
	{
		titulo: {
			type: String,
			required: true,
			trim: true
		},
		genero: {
			type: String,
			required: true,
			trim: true
		},
		año: {
			type: Number,
			required: true
		},
		duracion: {
			type: Number,
			required: true,
			min: 1
		},
		idioma: {
			type: String,
			required: true,
			trim: true
		},
		calificacion: {
			type: Number,
			required: true,
			min: 0,
			max: 10
		}
	},
	{
		timestamps: true
	}
);

const Pelicula = mongoose.model(
	"Pelicula",
	peliculaSchema,
	"Peliculas"
);

//consulta
app.get("/peliculas", async (req, res) => {
	try {
		const peliculas = await Pelicula.find();

		res.json(peliculas);
	} catch (error) {
		res.status(500).json({
			mensaje: "Error al consultar las películas",
			error: error.message
		});
	}
});

//guardar
app.post("/peliculas", async (req, res) => {
	try {
		const {
			titulo,
			genero,
			año,
			duracion,
			idioma,
			calificacion
		} = req.body;

		const nuevaPelicula = new Pelicula({
			titulo,
			genero,
			año,
			duracion,
			idioma,
			calificacion
		});

		const peliculaGuardada = await nuevaPelicula.save();

		res.status(201).json({
			mensaje: "Película guardada correctamente",
			pelicula: peliculaGuardada
		});
	} catch (error) {
		res.status(500).json({
			mensaje: "Error al guardar la película",
			error: error.message
		});
	}
});

//put
app.put("/peliculas/:id", async (req, res) => {
	try {
		const {
			titulo,
			genero,
			año,
			duracion,
			idioma,
			calificacion
		} = req.body;

		const peliculaActualizada = await Pelicula.findByIdAndUpdate(
			req.params.id,
			{
				titulo,
				genero,
				año,
				duracion,
				idioma,
				calificacion
			},
			{
				new: true,
				runValidators: true
			}
		);

		if (!peliculaActualizada) {
			return res.status(404).json({
				mensaje: "Película no encontrada"
			});
		}

		res.json({
			mensaje: "Película actualizada correctamente",
			pelicula: peliculaActualizada
		});
	} catch (error) {
		res.status(500).json({
			mensaje: "Error al actualizar la película",
			error: error.message
		});
	}
});

//delete
app.delete("/peliculas/:id", async (req, res) => {
	try {
		const peliculaEliminada = await Pelicula.findByIdAndDelete(
			req.params.id
		);

		if (!peliculaEliminada) {
			return res.status(404).json({
				mensaje: "Película no encontrada"
			});
		}

		res.json({
			mensaje: "Película eliminada correctamente",
			pelicula: peliculaEliminada
		});
	} catch (error) {
		res.status(500).json({
			mensaje: "Error al eliminar la película",
			error: error.message
		});
	}
});