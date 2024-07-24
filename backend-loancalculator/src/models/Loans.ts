import { DataTypes, Sequelize } from "sequelize";
import { LoanModel, LoanAttributes } from "../utils/Interfaces";

export class Loans {
    loanModel(context: Sequelize) {
        return this.loans(context);
    }
    private loans(context: Sequelize) {
        return context.define<LoanModel, LoanAttributes>('LOAN',
            {
                loanid: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                guid: {
                    type: DataTypes.UUIDV4
                },
                amount: {
                    type: DataTypes.NUMBER
                },
                isamountpaid: {
                    type: DataTypes.BOOLEAN
                },
                loantakendate: {
                    type: DataTypes.DATE
                },
                memberid: {
                    type: DataTypes.INTEGER
                },
                datecreated: {
                    type: DataTypes.DATE
                },
                datemodified: {
                    type: DataTypes.DATE
                },
                datedeleted: {
                    type: DataTypes.DATE
                },
            },
            {
                timestamps: false,
                tableName: "loans"
            });
    }
}