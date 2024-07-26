"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanTransactions = void 0;
const sequelize_1 = require("sequelize");
class LoanTransactions {
    loanTransactionModel(context) {
        return this.loantransactions(context);
    }
    loantransactions(context) {
        return context.define('LOANTXN', {
            loantransactionid: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            guid: {
                type: sequelize_1.DataTypes.UUIDV4
            },
            paidamount: {
                type: "NUMERIC",
                get() {
                    const rawValue = this.getDataValue('paidamount');
                    return rawValue ? parseFloat(rawValue) : null;
                },
                set(value) {
                    value = parseFloat(value);
                    this.setDataValue('paidamount', value);
                },
            },
            paidtype: {
                type: sequelize_1.DataTypes.ENUM,
                values: ['interest', 'principal'],
                defaultValue: null
            },
            paiddate: {
                type: sequelize_1.DataTypes.DATE
            },
            loanid: {
                type: sequelize_1.DataTypes.INTEGER
            },
            datecreated: {
                type: sequelize_1.DataTypes.DATE
            },
            datemodified: {
                type: sequelize_1.DataTypes.DATE
            },
            datedeleted: {
                type: sequelize_1.DataTypes.DATE
            },
        }, {
            timestamps: false,
            tableName: "loantransactions"
        });
    }
}
exports.LoanTransactions = LoanTransactions;
//# sourceMappingURL=LoanTransactions.js.map