import { DataTypes, Sequelize } from "sequelize";
import { LoanTransactionModel, LoanTransactionAttributes } from "../utils/Interfaces";

export class LoanTransactions {
    loanTransactionModel(context: Sequelize) {
        return this.loantransactions(context);
    }
    private loantransactions(context: Sequelize) {
        return context.define<LoanTransactionModel, LoanTransactionAttributes>('LOANTXN',
            {
                loantransactionid: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                guid: {
                    type: DataTypes.UUIDV4
                },
                paidamount: {
                    type: "NUMERIC",
                    get() {
                        const rawValue = this.getDataValue('paidamount');
                        return rawValue ? parseFloat(rawValue as any) : null;
                    },

                    set(value: any) {
                        value = parseFloat(value);
                        this.setDataValue('paidamount', value);
                    },
                },
                paidtype: {
                    type: DataTypes.ENUM,
                    values: ['interest', 'principal'],
                    defaultValue: null
                },
                paiddate: {
                    type: "TIMESTAMP",
                },
                loanid: {
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
                tableName: "loantransactions"
            });
    }
}