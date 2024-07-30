"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberController = void 0;
const DBConnection_1 = require("../connection/DBConnection");
const MemberService_1 = require("../services/MemberService");
const MemberMapper_1 = require("../mapper/MemberMapper");
const logger_1 = require("../utils/logger");
class MemberController {
    getMembers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbContext = (0, DBConnection_1.createDbContext)();
            const memberService = new MemberService_1.MemberService(dbContext);
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const offset = pageSize * (page - 1);
            const orderBy = req.query.orderBy ? req.query.orderBy : 'firstname';
            const orderDir = req.query.orderDir ? req.query.orderDir : 'ASC';
            const search = req.query.search || '';
            const { count, data } = yield memberService.getMembers(search, pageSize, offset, orderBy, orderDir);
            const dto = new MemberMapper_1.MemberMapper().listMapper(data);
            res.header('x-count', count);
            return res.status(200).send(dto);
        });
    }
    getMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbContext = (0, DBConnection_1.createDbContext)();
            const memberId = req.params.memberid;
            const memberService = new MemberService_1.MemberService(dbContext);
            const member = yield memberService.getDetailById(memberId);
            const dto = new MemberMapper_1.MemberMapper().detailMapper(member);
            return res.status(200).send(dto);
        });
    }
    addMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberBody = req.body;
            const dbContext = (0, DBConnection_1.createDbContext)();
            const logger = new logger_1.Logger();
            const memberService = new MemberService_1.MemberService(dbContext);
            const model = new MemberMapper_1.MemberMapper().postMapper(memberBody);
            if (!model.firstname) {
                logger.infoLog('Firstname cannot be empty.', 'addMember');
                return res.status(400).send({ message: "Bad Request" });
            }
            if (!model.lastname) {
                logger.infoLog('Lastname cannot be empty.', 'addMember');
                return res.status(400).send({ message: "Bad Request" });
            }
            // const mem = await memberService.checkMember(model.emailaddress, '', req.method);
            // if (mem) {
            //     logger.infoLog('Member already exists.', 'addMember');
            //     return res.status(409).send({ message: "Record exists" });
            // }
            const member = yield memberService.createMember(model);
            return res.status(201).send({ id: member.guid });
        });
    }
    updateMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberBody = req.body;
            const memberId = req.params.memberid;
            const logger = new logger_1.Logger();
            const dbContext = (0, DBConnection_1.createDbContext)();
            const memberService = new MemberService_1.MemberService(dbContext);
            const model = new MemberMapper_1.MemberMapper().postMapper(memberBody);
            if (!model.firstname) {
                logger.infoLog('Firstname cannot be empty.', 'updateMember');
                return res.status(400).send({ message: "Bad Request" });
            }
            if (!model.lastname) {
                logger.infoLog('Lastname cannot be empty.', 'updateMember');
                return res.status(400).send({ message: "Bad Request" });
            }
            // const mem = await memberService.checkMember(model.emailaddress, memberId, req.method);
            // if (mem) {
            //     logger.infoLog('Member already exists.', 'updateMember');
            //     return res.status(409).send({ message: "Record exists" });
            // }
            yield memberService.updateMember(memberId, model);
            return res.status(204).send();
        });
    }
    deleteMember(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberId = req.params.memberid;
            const dbContext = (0, DBConnection_1.createDbContext)();
            const memberService = new MemberService_1.MemberService(dbContext);
            yield memberService.deleteMember(memberId);
            return res.status(204).send();
        });
    }
}
exports.MemberController = MemberController;
//# sourceMappingURL=MemberController.js.map