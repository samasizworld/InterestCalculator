import { Sequelize } from "sequelize";
import { GeneralService } from "./GeneralService";
import { LoanModel } from "../utils/Interfaces";
import { Loans } from "../models/Loans";

export class LoanService extends GeneralService<LoanModel> {
    protected loanModel;
    constructor(context: Sequelize) {
        const loanModel = new Loans().loanModel(context);
        super(loanModel);
        this.loanModel = loanModel;
    }

    async getLoans(search: string, pageSize: number, offset: number, orderBy: string, orderDir: string, key: string, value: any) {
        const obj = { key, value };
        return await this.getLists(search, pageSize, offset, orderDir, orderBy, obj);
    }
    async createLoan(model: LoanModel) {
        return await this.insert(model)
    }
    async updateLoan(id: string, model: LoanModel) {
        return await this.updateById(id, model)
    }
    async deleteLoan(id: string) {
        return await this.delete(id);
    }
    async getLoan(id: string) {
        return await this.getDetailById(id);
    }
}