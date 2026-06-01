import MateriasRepository from '../repositories/materias-repository.js';
import CursosService from './cursos-service.js';

export default class MateriasService {
    constructor() {
        console.log('Estoy en: MateriasService.constructor()');
        this.MateriasRepository = new MateriasRepository();
        this.CursosService = new CursosService();
    }

    getAllAsync = async () => {
        console.log('MateriasService.getAllAsync()');
        const returnArray = await this.MateriasRepository.getAllAsync();
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`MateriasService.getByIdAsync(${id})`);
        const returnEntity = await this.MateriasRepository.getByIdAsync(id);
        return returnEntity;
    }

    createAsync = async (entity) => {
        console.log(`MateriasService.createAsync(${JSON.stringify(entity)})`);

        if (entity.id_curso) {
            await this.validarCursoExiste(entity.id_curso);
        }

        const newId = await this.MateriasRepository.createAsync(entity);
        return newId;
    }

    updateAsync = async (entity) => {
        console.log(`MateriasService.updateAsync(${JSON.stringify(entity)})`);

        if (entity.id_curso) {
            await this.validarCursoExiste(entity.id_curso);
        }

        const rowsAffected = await this.MateriasRepository.updateAsync(entity);
        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        console.log(`MateriasService.deleteByIdAsync(${id})`);

        const rowsAffected = await this.MateriasRepository.deleteByIdAsync(id);
        return rowsAffected;
    }

    validarCursoExiste = async (idCurso) => {
        const curso = await this.CursosService.getByIdAsync(idCurso);

        if (curso == null) {
            throw new Error(`El curso con id ${idCurso} no existe.`);
        }
    }
}