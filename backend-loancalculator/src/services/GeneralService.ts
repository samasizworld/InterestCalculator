import { Model, ModelCtor, Op, Sequelize } from "sequelize";

export class GeneralService<T extends Model> {
    private dbContext: ModelCtor<any>;
    constructor(context: any) {
        this.dbContext = context;
    }
    async getLists(searchQuery: any, pageSize: number, offset: number, orderDir: string, orderBy: string, obj?: { key: string, value: any }): Promise<{ data: T[]; count: number }> {
        let whereQuery: any = { datedeleted: null };
        if (obj && obj.key && obj.value) {
            whereQuery[obj.key] = obj.value;
        }
        if (searchQuery) {
            whereQuery = { ...whereQuery, ...searchQuery };
        }

        let result: { data: T[]; count: number } = { data: [], count: 0 };

        const orderByAttributeType = this.dbContext.getAttributes()[orderBy]?.type;
        if (pageSize == 0) {
            if (orderByAttributeType == 'TEXT') {
                result.data = await this.dbContext.findAll({
                    where: whereQuery, order: [[Sequelize.fn('lower', Sequelize.col(orderBy)), orderDir]]
                })
            } else {
                result.data = await this.dbContext.findAll({
                    where: whereQuery, order: [[orderBy, orderDir]]
                })
            }
        } else {
            if (orderByAttributeType == 'TEXT') {
                result.data = await this.dbContext.findAll({
                    where: whereQuery, order: [[Sequelize.fn('lower', Sequelize.col(orderBy)), orderDir]], limit: pageSize, offset: offset
                })
            } else {
                result.data = await this.dbContext.findAll({
                    where: whereQuery, order: [[orderBy, orderDir]], limit: pageSize, offset: offset
                })
            }
        }
        result.count = await this.dbContext.count({ where: whereQuery });
        return result;
    }


    async getDetailById(id: string): Promise<T | null> {
        return await this.dbContext.findOne({ where: { guid: id, datedeleted: null } });
    }

    async insert(model: Partial<T>): Promise<T> {
        return await this.dbContext.create(model) as T;
    }

    async updateById(id: string, model: Partial<T>): Promise<T | null> {
        const [affectedCount, affectedRows] = await this.dbContext.update(model, {
            where: { guid: id, datedeleted: null },
            returning: true
        });
        return affectedRows[0] || null;
    }

    async delete(id: string): Promise<void> {
        await this.dbContext.update({ datedeleted: new Date() }, { where: { guid: id, datedeleted: null } });
    }
}