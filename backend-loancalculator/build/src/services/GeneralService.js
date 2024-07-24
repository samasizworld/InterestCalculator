"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralService = void 0;
const sequelize_1 = require("sequelize");
class GeneralService {
    constructor(context) {
        this.dbContext = context;
    }
    getLists(search, pageSize, offset, orderDir, orderBy, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let whereQuery = { datedeleted: null };
            if (obj && obj.key && obj.value) {
                whereQuery[obj.key] = obj.value;
            }
            let result = { data: [], count: 0 };
            if (search) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.iLike]: `%${search}%` } },
                        { body: { [sequelize_1.Op.iLike]: `%${search}%` } },
                        { subject: { [sequelize_1.Op.iLike]: `%${search}%` } },
                    ] });
            }
            const orderByAttributeType = (_a = this.dbContext.getAttributes()[orderBy]) === null || _a === void 0 ? void 0 : _a.type;
            if (pageSize == 0) {
                if (orderByAttributeType == 'TEXT') {
                    result.data = yield this.dbContext.findAll({
                        where: whereQuery, order: [[sequelize_1.Sequelize.fn('lower', sequelize_1.Sequelize.col(orderBy)), orderDir]]
                    });
                }
                else {
                    result.data = yield this.dbContext.findAll({
                        where: whereQuery, order: [[orderBy, orderDir]]
                    });
                }
            }
            else {
                if (orderByAttributeType == 'TEXT') {
                    result.data = yield this.dbContext.findAll({
                        where: whereQuery, order: [[sequelize_1.Sequelize.fn('lower', sequelize_1.Sequelize.col(orderBy)), orderDir]], limit: pageSize, offset: offset
                    });
                }
                else {
                    result.data = yield this.dbContext.findAll({
                        where: whereQuery, order: [[orderBy, orderDir]], limit: pageSize, offset: offset
                    });
                }
            }
            result.count = yield this.dbContext.count({ where: whereQuery });
            return result;
        });
    }
    getDetailById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dbContext.findOne({ where: { guid: id, datedeleted: null } });
        });
    }
    insert(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dbContext.create(model);
        });
    }
    updateById(id, model) {
        return __awaiter(this, void 0, void 0, function* () {
            const [affectedCount, affectedRows] = yield this.dbContext.update(model, {
                where: { guid: id, datedeleted: null },
                returning: true
            });
            return affectedRows[0] || null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dbContext.update({ datedeleted: new Date() }, { where: { guid: id, datedeleted: null } });
        });
    }
}
exports.GeneralService = GeneralService;
//# sourceMappingURL=GeneralService.js.map