"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Members = void 0;
const sequelize_1 = require("sequelize");
class Members {
    memberModel(context) {
        return this.members(context);
    }
    members(context) {
        return context.define('MEMBER', {
            memberid: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            guid: {
                type: sequelize_1.DataTypes.UUIDV4
            },
            firstname: {
                type: sequelize_1.DataTypes.STRING
            },
            middlename: {
                type: sequelize_1.DataTypes.STRING
            },
            lastname: {
                type: sequelize_1.DataTypes.STRING
            },
            emailaddress: {
                type: sequelize_1.DataTypes.STRING
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
            tableName: "members"
        });
    }
}
exports.Members = Members;
//# sourceMappingURL=Members.js.map