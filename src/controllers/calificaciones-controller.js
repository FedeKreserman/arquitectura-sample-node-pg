import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import CalificacionesService from './../services/calificaciones-service.js';
import Calificacion from './../entities/calificacion.js';

const router = Router();
const currentService = new CalificacionesService();


router.get('/test-insert', async (req, res) => {
    console.log('/test-insert');

    try {
        const nuevaCalificacion = new Calificacion(
            0,              // id
            1,              // id_alumno
            1,              // id_materia
            8,              // nota
            '2026-06-08'    // fecha
        );

        console.log('Objeto Calificacion creado desde código:', nuevaCalificacion);

        const newId = await currentService.createAsync(nuevaCalificacion);

        if (newId > 0) {
            res.status(StatusCodes.CREATED).json({
                message: `Se creó la calificación desde código con id: ${newId}`,
                calificacion: nuevaCalificacion,
                newId: newId
            });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'No se pudo crear la calificación.'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).send(`Error: ${error.message}`);
    }
});

router.get('', async (req, res) => {
    try {
        console.log('CalificacionesController.get');

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
        const id = req.params.id;

        const returnEntity = await currentService.getByIdAsync(id);

        if (returnEntity != null) {
            res.status(StatusCodes.OK).json(returnEntity);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
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

        if (rowsAffected !== 0) {
            res.status(StatusCodes.OK).json(rowsAffected);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).send(`Error: ${error.message}`);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const rowCount = await currentService.deleteByIdAsync(id);

        if (rowCount !== 0) {
            res.status(StatusCodes.OK).json(null);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
    }
});

export default router;