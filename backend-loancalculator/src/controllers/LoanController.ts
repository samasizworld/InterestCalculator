import { Request, Response } from "express";
import { createDbContext } from "../connection/DBConnection";
import { LoanService } from "../services/LoanService";
import { LoanMapper } from "../mapper/LoanMapper";
import { MemberService } from "../services/MemberService";
import { Logger } from "../utils/logger";
import { LoanTransactionService } from "../services/LoanTransactionService";
import { LoanTransactionMapper } from "../mapper/LoanTransactionMapper";

export class LoanController {
    async getLoans(req: Request, res: Response) {
        const dbContext = createDbContext();
        const loanService = new LoanService(dbContext);
        const memberService = new MemberService(dbContext);
        const logger = new Logger();
        const memberId = req.params.memberid;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 20;
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const offset = pageSize * (page - 1);
        const orderBy = req.query.orderBy ? (req.query.orderBy as string) : 'datecreated';
        const orderDir = req.query.orderDir ? (req.query.orderDir as string) : 'DESC';
        const search = (req.query.search as string) || '';
        const member = await memberService.getMember(memberId);
        if (!member) {
            logger.infoLog('Member not found', 'getLoans');
            return res.status(404).send({ message: "Resource not found." });
        }
        const { count, data } = await loanService.getLoans(search, pageSize, offset, orderBy, orderDir, 'memberid', member.memberid);
        const dto = new LoanMapper().listMapper(data);
        res.header('x-count', count as any)
        return res.status(200).send(dto);
    }

    async getLoan(req: Request, res: Response) {
        const dbContext = createDbContext();
        const loanId = req.params.loanid;
        const loanService = new LoanService(dbContext);
        const loanTransactionService = new LoanTransactionService(dbContext);
        const logger = new Logger();
        const loan = await loanService.getDetailById(loanId);
        if (!loan) {
            logger.infoLog('Loan not found', 'getLoan');
            return res.status(404).send({ message: "Resource not found." });
        }
        const txns = await loanTransactionService.getTransactions(loan.loanid);
        const transactions = new LoanTransactionMapper().listMapper(txns)
        const dto = new LoanMapper().detailMapper(loan, transactions);
        return res.status(200).send(dto);
    }

    async calculateInterest(req: Request, res: Response) {
        const dbContext = createDbContext();
        const loanId = req.params.loanid;
        const loanService = new LoanService(dbContext);
        const loanTransactionService = new LoanTransactionService(dbContext);
        const logger = new Logger();
        const loan = await loanService.getDetailById(loanId);
        if (!loan) {
            logger.infoLog('Loan not found', 'getLoan');
            return res.status(404).send({ message: "Resource not found." });
        }
        const txns = await loanTransactionService.getTransactions(loan.loanid);
        const transactions = new LoanTransactionMapper().listMapper(txns)
        const dto = new LoanMapper().interestMapper(loan, transactions);
        return res.status(200).send(dto);
    }

    async addLoan(req: Request, res: Response) {
        const loanBody = req.body;
        const memberId = req.params.memberid;
        const dbContext = createDbContext();
        const loanService = new LoanService(dbContext);
        const memberService = new MemberService(dbContext);
        const logger = new Logger();
        const member = await memberService.getMember(memberId);
        if (!member) {
            logger.infoLog('Member not found', 'addLoan');
            return res.status(404).send({ message: "Resource not found." });
        }
        const model: any = new LoanMapper().postMapper(loanBody, member.memberid);
        const loan = await loanService.createLoan(model);
        return res.status(201).send({ id: loan.guid });
    }

    async updateLoan(req: Request, res: Response) {
        const loanBody = req.body;
        const loanId = req.params.loanid;
        const memberId = req.params.memberid;
        const dbContext = createDbContext();
        const loanService = new LoanService(dbContext);
        const memberService = new MemberService(dbContext);
        const logger = new Logger();
        const member = await memberService.getMember(memberId);
        if (!member) {
            logger.infoLog('Member not found', 'addLoan');
            return res.status(404).send({ message: "Resource not found." });
        }
        const model: any = new LoanMapper().postMapper(loanBody, member.memberid);
        await loanService.updateLoan(loanId, model);
        return res.status(204).send();
    }

    async deleteLoan(req: Request, res: Response) {
        const loanId = req.params.loanid;
        const dbContext = createDbContext();
        const loanService = new LoanService(dbContext);
        await loanService.deleteLoan(loanId);
        return res.status(204).send();
    }
}