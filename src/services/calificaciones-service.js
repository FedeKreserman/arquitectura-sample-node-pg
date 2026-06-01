import CalificacionesRepository from '../repositories/calificaciones-repository.js';
import AlumnosService from './alumnos-service.js';
import MateriasService from './materias-service.js';

export default class CalificacionesService {

    constructor() {
        console.log('Estoy en: CalificacionesService.constructor()');

        this.CalificacionesRepository = new CalificacionesRepository();
        this.AlumnosService = new AlumnosService();
        this.MateriasService = new MateriasService();
    }

    getAllAsync = async () => {
        console.log(`CalificacionesService.getAllAsync()`);

        const returnArray = await this.CalificacionesRepository.getAllAsync();

        if (returnArray == null) {
            return null;
        }

        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`CalificacionesService.getByIdAsync(${id})`);

        const returnEntity = await this.CalificacionesRepository.getByIdAsync(id);

        if (returnEntity == null) {
            return null;
        }

        return returnEntity;
    }

    getByAlumnoAsync = async (idAlumno) => {
        console.log(`CalificacionesService.getByAlumnoAsync(${idAlumno})`);

        // Validación: el alumno debe existir
        await this.validarAlumnoExiste(idAlumno);

        const returnArray = await this.CalificacionesRepository.getByAlumnoAsync(idAlumno);

        return returnArray;
    }

    createAsync = async (entity) => {
        console.log(`CalificacionesService.createAsync(${JSON.stringify(entity)})`);

        // Validación: nota entre 0 y 10
        if (entity.nota < 0 || entity.nota > 10) {

            const error = new Error('La nota debe estar entre 0 y 10');
            error.status = 400;
            throw error;
        }

        // Validación: el alumno debe existir
        await this.validarAlumnoExiste(entity.id_alumno);

        // Validación: la materia debe existir
        await this.validarMateriaExiste(entity.id_materia);

        // Validación: no debe existir calificación previa
        const calificacionExistente =
            await this.CalificacionesRepository.getByAlumnoMateriaAsync(
                entity.id_alumno,
                entity.id_materia
            );

        if (calificacionExistente != null) {

            const error = new Error('Ya existe una calificación para ese alumno y materia');
            error.status = 409;
            throw error;
        }

        const rowsAffected = await this.CalificacionesRepository.createAsync(entity);

        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(`CalificacionesService.updateAsync(${JSON.stringify(entity)})`);

        // Validación: la calificación debe existir
        const calificacionExistente =
            await this.CalificacionesRepository.getByIdAsync(entity.id);

        if (calificacionExistente == null) {

            const error = new Error('La calificación no existe');
            error.status = 404;
            throw error;
        }

        // Validación: si viene nota, debe estar entre 0 y 10
        if (entity.nota != undefined) {

            if (entity.nota < 0 || entity.nota > 10) {

                const error = new Error('La nota debe estar entre 0 y 10');
                error.status = 400;
                throw error;
            }
        }

        const rowsAffected = await this.CalificacionesRepository.updateAsync(entity);

        return rowsAffected;
    }

    validarAlumnoExiste = async (id) => {

        const alumno = await this.AlumnosService.getByIdAsync(id);

        if (alumno == null) {

            const error = new Error(`El alumno con id ${id} no existe`);
            error.status = 404;
            throw error;
        }
    }

    validarMateriaExiste = async (id) => {

        const materia = await this.MateriasService.getByIdAsync(id);

        if (materia == null) {

            const error = new Error(`La materia con id ${id} no existe`);
            error.status = 404;
            throw error;
        }
    }
}