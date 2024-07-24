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
exports.LoanTransactionService = void 0;
const GeneralService_1 = require("./GeneralService");
const LoanTransactions_1 = require("../models/LoanTransactions");
class LoanTransactionService extends GeneralService_1.GeneralService {
    constructor(context) {
        const loanTxnModel = new LoanTransactions_1.LoanTransactions().loanTransactionModel(context);
        super(loanTxnModel);
        this.loanTxnModel = loanTxnModel;
    }
    getTransactions(loanid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.loanTxnModel.findAll({ where: { datedeleted: null, loanid }, order: [['loantransactionid', 'asc']] });
        });
    }
    createLoanTransaction(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.insert(model);
        });
    }
    updateLoanTransaction(id, model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.updateById(id, model);
        });
    }
    deleteLoanTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delete(id);
        });
    }
}
exports.LoanTransactionService = LoanTransactionService;
//# sourceMappingURL=LoanTransactionService.js.map