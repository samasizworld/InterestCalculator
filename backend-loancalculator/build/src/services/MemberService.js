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
exports.MemberService = void 0;
const sequelize_1 = require("sequelize");
const GeneralService_1 = require("./GeneralService");
const Members_1 = require("../models/Members");
class MemberService extends GeneralService_1.GeneralService {
    constructor(context) {
        const memberModel = new Members_1.Members().memberModel(context);
        super(memberModel);
        this.memberModel = memberModel;
    }
    getMembers(search, pageSize, offset, orderBy, orderDir) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getLists(search, pageSize, offset, orderDir, orderBy);
        });
    }
    createMember(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.insert(model);
        });
    }
    updateMember(id, model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.updateById(id, model);
        });
    }
    deleteMember(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delete(id);
        });
    }
    getMember(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getDetailById(id);
        });
    }
    checkMember(emailaddress_1, id_1) {
        return __awaiter(this, arguments, void 0, function* (emailaddress, id, method = 'POST') {
            if (method == 'POST' && !id) {
                return yield this.memberModel.findOne({ where: { datedeleted: null, emailaddress } });
            }
            else {
                return yield this.memberModel.findOne({ where: { datedeleted: null, emailaddress, guid: { [sequelize_1.Op.ne]: id } } });
            }
        });
    }
}
exports.MemberService = MemberService;
//# sourceMappingURL=MemberService.js.map