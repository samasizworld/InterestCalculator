import { Sequelize } from "sequelize";
import { GeneralService } from "./GeneralService";
import { LoanTransactionModel } from "../utils/Interfaces";
import { LoanTransactions } from "../models/LoanTransactions";

export class LoanTransactionService extends GeneralService<LoanTransactionModel> {
    protected loanTxnModel;
    constructor(context: Sequelize) {
        const loanTxnModel = new LoanTransactions().loanTransactionModel(context);
        super(loanTxnModel);
        this.loanTxnModel = loanTxnModel;
    }

    async getTransactions(loanid: number) {
        return await this.loanTxnModel.findAll({ where: { datedeleted: null, loanid }, order: [['loantransactionid', 'asc']] });
    }
    async createLoanTransaction(model: LoanTransactionModel) {
        return await this.insert(model)
    }
    async updateLoanTransaction(id: string, model: LoanTransactionModel) {
        return await this.updateById(id, model)
    }
    async deleteLoanTransaction(id: string) {
        return await this.delete(id);
    }
}