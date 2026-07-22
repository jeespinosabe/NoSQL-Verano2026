const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan("dev"));

mongoose.connect("mongodb://localhost:27017/escuela")
	.then(() => {
		console.log("Conectado correctamente a MongoDB");
	})
	.catch((error) => {
		console.log("Error al conectar a MongoDB:", error);
	});

const alumnoSchema = new mongoose.Schema(
	{
		nombre: {
			type: String,
			required: true,
			trim: true
		},
		carrera: {
			type: String,
			required: true,
			trim: true
		},
		semestre: {
			type: Number,
			required: true,
			min: 1
		}
	},
	{
		timestamps: true
	}
);

const Alumno = mongoose.model("Alumno", alumnoSchema, "Alumnos");

app.get("/alumnos", async (req, res) => {
	try {
		const alumnos = await Alumno.find();

		res.json(alumnos);
	} catch (error) {
		res.status(500).json({
			mensaje: "Error al obtener los alumnos",
			error: error.message
		});
	}
});

app.get("/alumnos/:id", async (req, res) => {
	try {
		const alumno = await Alumno.findById(req.params.id);

		if (!alumno) {
			return res.status(404).json({
				mensaje: "Alumno no encontrado"
			});
		}

		res.json(alumno);
	} catch (error) {
		res.status(500).json({
			mensaje: "Error al obtener el alumno",
			error: error.message
		});
	}
});

app.post("/alumnos", async (req, res) => {
	try {
		const { nombre, carrera, semestre } = req.body;

		if (!nombre || !carrera || !semestre) {
			return res.status(400).json({
				mensaje: "Faltan datos del alumno"
			});
		}

		const nuevoAlumno = new Alumno({
			nombre,
			carrera,
			semestre
		});

		const alumnoGuardado = await nuevoAlumno.save();

		res.status(201).json({
			mensaje: "Alumno registrado correctamente",
			alumno: alumnoGuardado
		});
	} catch (error) {
		res.status(500).json({
			mensaje: "Error al registrar el alumno",
			error: error.message
		});
	}
});

app.put("/alumnos/:id", async (req, res) => {
	try {
		const { nombre, carrera, semestre } = req.body;

		if (!nombre || !carrera || !semestre) {
			return res.status(400).json({
				mensaje: "Faltan datos del alumno"
			});
		}

		const alumnoActualizado = await Alumno.findByIdAndUpdate(
			req.params.id,
			{
				nombre,
				carrera,
				semestre
			},
			{
				new: true,
				runValidators: true
			}
		);

		if (!alumnoActualizado) {
			return res.status(404).json({
				mensaje: "Alumno no encontrado"
			});
		}

		res.json({
			mensaje: "Alumno actualizado correctamente",
			alumno: alumnoActualizado
		});
	} catch (error) {
		res.status(500).json({
			mensaje: "Error al actualizar el alumno",
			error: error.message
		});
	}
});

app.delete("/alumnos/:id", async (req, res) => {
	try {
		const alumnoEliminado = await Alumno.findByIdAndDelete(
			req.params.id
		);

		if (!alumnoEliminado) {
			return res.status(404).json({
				mensaje: "Alumno no encontrado"
			});
		}

		res.json({
			mensaje: "Alumno eliminado correctamente",
			alumno: alumnoEliminado
		});
	} catch (error) {
		res.status(500).json({
			mensaje: "Error al eliminar el alumno",
			error: error.message
		});
	}
});

app.get("/", (req, res) => {
	res.send("Hola Mario");
});

app.get("/mensaje", (req, res) => {
	res.send("Mensaje desde Express");
});

app.get("/pagina", (req, res) => {
	res.send(`
		<h1>Mi página web</h1>
		<p style="color: blue;">Creada con Express</p>
	`);
});

app.get("/alumno", (req, res) => {
	res.json({
		nombre: "Jesus",
		carrera: "ISC",
		semestre: 7
	});
});

app.get("/materias", (req, res) => {
	res.json([
		{
			nombre: "NoSQL",
			hora: "8:00-11:00"
		},
		{
			nombre: "Leng. y Auto. II",
			hora: "11:00-2:00"
		}
	]);
});

app.get("/mensaje/:nombre", (req, res) => {
	res.send(`Hola ${req.params.nombre}`);
});

app.get("/suma/:a/:b", (req, res) => {
	const a = Number(req.params.a);
	const b = Number(req.params.b);

	res.send(`Resultado: ${a + b}`);
});

app.get("/multiplicar/:a/:b", (req, res) => {
	const a = Number(req.params.a);
	const b = Number(req.params.b);

	res.send(`Resultado: ${a * b}`);
});

app.get("/aleatorio", (req, res) => {
	const numero = Math.floor(Math.random() * 100) + 1;

	res.send(`Número aleatorio: ${numero}`);
});

app.listen(port, () => {
	console.log(`Servidor iniciado en http://localhost:${port}`);
});