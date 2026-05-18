export default class MateriasService {
    constructor() {
        console.log('Estoy en: MateriasService.constructor()');
        this.MateriasRepository = new MateriasRepository();
        this.CursosService = new CursosService();
    }

    getAllAsync = async () => {
        console.log(`MateriasService.getAllAsync()`);
        const returnArray = await this.MateriasRepository.getAllAsync();
        if (returnArray == null) return null;
        return rowsAffected;
    }

    getByIdAsync = async (id) => {
        console.log(`MateriasService.getByIdAsync(${id})`);
        const returnEntity = await this.MateriasRepository.getByIdAsync(id);
       
        return rowsAffected;
    }

    createAsync = async (entity) => {
        console.log(`MateriasService.createAsync(${JSON.stringify(entity)})`);
       
        await this.validarCursoExiste(entity.id_curso)
        const rowsAffected = await this.MateriasRepository.createAsync(entity);
        
        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(`MateriasService.updateAsync(${JSON.stringify(entity)})`);
        
        if (entity.id_curso) {
            await this.validarCursoExiste(entity.id_curso);
        }
        
        const rowsAffected = await this.MateriasRepository.updateAsync(entity);
        return rowsAffected;
    }
}
