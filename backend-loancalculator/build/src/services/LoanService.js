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
exports.LoanService = void 0;
const GeneralService_1 = require("./GeneralService");
const Loans_1 = require("../models/Loans");
class LoanService extends GeneralService_1.GeneralService {
    constructor(context) {
        const loanModel = new Loans_1.Loans().loanModel(context);
        super(loanModel);
        this.loanModel = loanModel;
    }
    getLoans(search, pageSize, offset, orderBy, orderDir, key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = { key, value };
            let searchQuery;
            if (search) {
                searchQuery = '';
            }
            return yield this.getLists(searchQuery, pageSize, offset, orderDir, orderBy, obj);
        });
    }
    createLoan(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.insert(model);
        });
    }
    updateLoan(id, model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.updateById(id, model);
        });
    }
    deleteLoan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delete(id);
        });
    }
    getLoan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getDetailById(id);
        });
    }
}
exports.LoanService = LoanService;
//# sourceMappingURL=LoanService.js.map