import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Controllers
import AlumnosController from '../controllers/alumnos-controller.js';
import CursosController from '../controllers/cursos-controller.js';
import CalificacionesController from '../controllers/calificaciones-controller.js';
import MateriasController from '../controllers/materias-controller.js';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoints
app.use('/api/alumnos', AlumnosController);
app.use('/api/cursos', CursosController);
app.use('/api/materias', MateriasController);
app.use('/api/calificaciones', CalificacionesController);

// Inicio del servidor
app.listen(port, () => {
    console.log('server.js');
    console.log(`Listening on http://localhost:${port}`);
});