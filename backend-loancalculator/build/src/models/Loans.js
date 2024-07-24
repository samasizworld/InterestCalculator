"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loans = void 0;
const sequelize_1 = require("sequelize");
class Loans {
    loanModel(context) {
        return this.loans(context);
    }
    loans(context) {
        return context.define('LOAN', {
            loanid: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            guid: {
                type: sequelize_1.DataTypes.UUIDV4
            },
            amount: {
                type: sequelize_1.DataTypes.NUMBER
            },
            isamountpaid: {
                type: sequelize_1.DataTypes.BOOLEAN
            },
            loantakendate: {
                type: sequelize_1.DataTypes.DATE
            },
            memberid: {
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
            tableName: "loans"
        });
    }
}
exports.Loans = Loans;
//# sourceMappingURL=Loans.js.map