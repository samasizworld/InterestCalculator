import { Request, Response } from "express";
import { createDbContext } from "../connection/DBConnection";
import { MemberService } from "../services/MemberService";
import { MemberMapper } from "../mapper/MemberMapper";
import { Logger } from '../utils/logger';

export class MemberController {
    async getMembers(req: Request, res: Response) {
        const dbContext = createDbContext();
        const memberService = new MemberService(dbContext);
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 20;
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const offset = pageSize * (page - 1);
        const orderBy = req.query.orderBy ? (req.query.orderBy as string) : 'firstname';
        const orderDir = req.query.orderDir ? (req.query.orderDir as string) : 'ASC';
        const search = (req.query.search as string) || '';

        const { count, data } = await memberService.getMembers(search, pageSize, offset, orderBy, orderDir);
        const dto = new MemberMapper().listMapper(data);
        res.header('x-count', count as any)
        return res.status(200).send(dto);
    }

    async getMember(req: Request, res: Response) {
        const dbContext = createDbContext();
        const memberId = req.params.memberid;
        const memberService = new MemberService(dbContext);
        const member = await memberService.getDetailById(memberId);
        const dto = new MemberMapper().detailMapper(member);
        return res.status(200).send(dto);
    }

    async addMember(req: Request, res: Response) {
        const memberBody = req.body;
        const dbContext = createDbContext();
        const logger = new Logger();
        const memberService = new MemberService(dbContext);
        const model: any = new MemberMapper().postMapper(memberBody);
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
        const member = await memberService.createMember(model);
        return res.status(201).send({ id: member.guid });
    }

    async updateMember(req: Request, res: Response) {
        const memberBody = req.body;
        const memberId = req.params.memberid;
        const logger = new Logger();
        const dbContext = createDbContext();
        const memberService = new MemberService(dbContext);
        const model: any = new MemberMapper().postMapper(memberBody);
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
        await memberService.updateMember(memberId, model);
        return res.status(204).send();
    }

    async deleteMember(req: Request, res: Response) {
        const memberId = req.params.memberid;
        const dbContext = createDbContext();
        const memberService = new MemberService(dbContext);
        await memberService.deleteMember(memberId);
        return res.status(204).send();
    }
}