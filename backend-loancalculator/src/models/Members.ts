import { DataTypes, Sequelize } from "sequelize";
import { MemberAttributes, MemberModel } from "../utils/Interfaces";

export class Members {
    memberModel(context: Sequelize) {
        return this.members(context);
    }
    private members(context: Sequelize) {
        return context.define<MemberModel, MemberAttributes>('MEMBER',
            {
                memberid: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                guid: {
                    type: DataTypes.UUIDV4
                },
                firstname: {
                    type: DataTypes.STRING
                },
                middlename: {
                    type: DataTypes.STRING
                },
                lastname: {
                    type: DataTypes.STRING
                },
                emailaddress:
                {
                    type: DataTypes.STRING
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
                tableName: "members"
            });
    }
}