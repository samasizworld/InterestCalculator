import { MemberModel } from "../utils/Interfaces";

export class MemberMapper {
    listMapper(members: MemberModel[]) {
        return members.map(member => {
            return {
                MemberId: member.guid,
                Firstname: member.firstname,
                Middlename: member.middlename,
                Lastname: member.lastname,
                Displayname: member.firstname?.trim() + ' ' + member.middlename?.trim() + ' ' + member?.lastname?.trim(),
                Emailaddress: member.emailaddress,
                Datemodified: member.datemodified
            }
        })
    }

    detailMapper(member: MemberModel) {
        return {
            MemberId: member.guid,
            Firstname: member.firstname,
            Middlename: member.middlename,
            Lastname: member.lastname,
            Emailaddress: member.emailaddress,
            Datemodified: member.datemodified
        }
    }

    postMapper(payload: { Firstname: string, Lastname: string, Middlename: string, Emailaddress: string }) {
        return {
            firstname: payload.Firstname,
            middlename: payload.Middlename,
            lastname: payload.Lastname,
            emailaddress: payload.Emailaddress
        }

    }
}