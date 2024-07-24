"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberMapper = void 0;
class MemberMapper {
    listMapper(members) {
        return members.map(member => {
            var _a, _b, _c;
            return {
                MemberId: member.guid,
                Firstname: member.firstname,
                Middlename: member.middlename,
                Lastname: member.lastname,
                Displayname: ((_a = member.firstname) === null || _a === void 0 ? void 0 : _a.trim()) + ' ' + ((_b = member.middlename) === null || _b === void 0 ? void 0 : _b.trim()) + ' ' + ((_c = member === null || member === void 0 ? void 0 : member.lastname) === null || _c === void 0 ? void 0 : _c.trim()),
                Emailaddress: member.emailaddress,
                Datemodified: member.datemodified
            };
        });
    }
    detailMapper(member) {
        return {
            MemberId: member.guid,
            Firstname: member.firstname,
            Middlename: member.middlename,
            Lastname: member.lastname,
            Emailaddress: member.emailaddress,
            Datemodified: member.datemodified
        };
    }
    postMapper(payload) {
        return {
            firstname: payload.Firstname,
            middlename: payload.Middlename,
            lastname: payload.Lastname,
            emailaddress: payload.Emailaddress
        };
    }
}
exports.MemberMapper = MemberMapper;
//# sourceMappingURL=MemberMapper.js.map