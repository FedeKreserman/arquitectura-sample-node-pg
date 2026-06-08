import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import MateriasService from './../services/materias-service.js';
import Materia from './../entities/materia.js';

const router = Router();
const currentService = new MateriasService();

// Probar con:
// GET http://localhost:3000/api/materias/test-insert
router.get('/test-insert', async (req, res) => {
    console.log('/test-insert');

    try {
        const nuevaMateria = new Materia(
            0,              // id
            'Programacion', // nombre
            1               // id_curso
        );

        console.log('Objeto Materia creado desde código:', nuevaMateria);

        const newId = await currentService.createAsync(nuevaMateria);

        if (newId > 0) {
            res.status(StatusCodes.CREATED).json({
                message: `Se creó la materia desde código con id: ${newId}`,
                materia: nuevaMateria,
                newId: newId
            });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'No se pudo crear la materia.'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).send(`Error: ${error.message}`);
    }
});

router.get('', async (req, res) => {
    try {
        const returnArray = await currentService.getAllAsync();

        if (returnArray != null) {
            res.status(StatusCodes.OK).json(returnArray);
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const returnEntity = await currentService.getByIdAsync(id);

        if (returnEntity != null) {
            res.status(StatusCodes.OK).json(returnEntity);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontró la entidad (id:${id}).`);
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
    }
});

router.post('', async (req, res) => {
    try {
        const entity = req.body;

        const newId = await currentService.createAsync(entity);

        if (newId > 0) {
            res.status(StatusCodes.CREATED).json(newId);
        } else {
            res.status(StatusCodes.BAD_REQUEST).json(null);
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).send(`Error: ${error.message}`);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const entity = req.body;

        if (entity.id && parseInt(entity.id) !== id) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(`El id de la URL (${id}) no coincide con el id del body (${entity.id}).`);
        }

        entity.id = id;

        const rowsAffected = await currentService.updateAsync(entity);

        if (rowsAffected > 0) {
            res.status(StatusCodes.OK).json(rowsAffected);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontró la entidad (id:${id}).`);
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).send(`Error: ${error.message}`);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const rowCount = await currentService.deleteByIdAsync(id);

        if (rowCount > 0) {
            res.status(StatusCodes.OK).json(null);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontró la entidad (id:${id}).`);
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
    }
});

export default router;