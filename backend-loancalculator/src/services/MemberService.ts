import { Op, Sequelize } from "sequelize";
import { GeneralService } from "./GeneralService";
import { Members } from "../models/Members";
import { MemberModel } from "../utils/Interfaces";

export class MemberService extends GeneralService<MemberModel> {
    protected memberModel;
    constructor(context: Sequelize) {
        const memberModel = new Members().memberModel(context);
        super(memberModel);
        this.memberModel = memberModel;
    }

    async getMembers(search: string, pageSize: number, offset: number, orderBy: string, orderDir: string) {
        let searchQuery: any;
        if (search) {
            searchQuery = {
                [Op.or]: [
                    { firstname: { [Op.iLike]: `%${search}%` } },
                    { emailaddress: { [Op.iLike]: `%${search}%` } },
                    { lastname: { [Op.iLike]: `%${search}%` } }
                ]
            }
        }
        return await this.getLists(searchQuery, pageSize, offset, orderDir, orderBy);
    }
    async createMember(model: MemberModel) {
        return await this.insert(model)
    }
    async updateMember(id: string, model: MemberModel) {
        return await this.updateById(id, model)
    }
    async deleteMember(id: string) {
        return await this.delete(id);
    }
    async getMember(id: string) {
        return await this.getDetailById(id);
    }

    async checkMember(emailaddress: string, id?: string, method: string = 'POST') {
        if (method == 'POST' && !id) {
            return await this.memberModel.findOne({ where: { datedeleted: null, emailaddress } });
        } else {
            return await this.memberModel.findOne({ where: { datedeleted: null, emailaddress, guid: { [Op.ne]: id } } });
        }
    }

    async getMemberByIntegerId(memberid: number) {
        return await this.memberModel.findOne({ where: { datedeleted: null, memberid } });
    }
}