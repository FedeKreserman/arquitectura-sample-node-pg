import Db from './db-pg.js';

export default class MateriasRepository {
    constructor() {
        console.log('Estoy en: MateriasRepository-new.constructor()');
        this.db = new Db();
    }

    getAllAsync = async () => {
        const sql = `SELECT * FROM materias`;
        return await this.db.queryAll(sql);
    }

    getByIdAsync = async (id) => {
        const sql = `SELECT * FROM materias WHERE id = $1`;
        return await this.db.queryOne(sql, [id]);
    }

    createAsync = async (entity) => {
        const sql = `
            INSERT INTO materias (
                nombre
            )
            VALUES (
                $1
            )
            RETURNING id
        `;

        const values = [
            entity?.nombre ?? ''
        ];

        return await this.db.queryReturnId(sql, values);
    }

    updateAsync = async (entity) => {
        const previousEntity = await this.getByIdAsync(entity.id);

        if (previousEntity == null) {
            return 0;
        }

        const sql = `
            UPDATE materias
            SET nombre = $2
            WHERE id = $1
        `;

        const values = [
            entity.id,
            entity?.nombre ?? previousEntity.nombre
        ];

        return await this.db.queryRowCount(sql, values);
    }

    deleteByIdAsync = async (id) => {
        const sql = `DELETE FROM materias WHERE id = $1`;
        return await this.db.queryRowCount(sql, [id]);
    }
}