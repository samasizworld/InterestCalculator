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
exports.LoanController = void 0;
const DBConnection_1 = require("../connection/DBConnection");
const LoanService_1 = require("../services/LoanService");
const LoanMapper_1 = require("../mapper/LoanMapper");
const MemberService_1 = require("../services/MemberService");
const logger_1 = require("../utils/logger");
const LoanTransactionService_1 = require("../services/LoanTransactionService");
const LoanTransactionMapper_1 = require("../mapper/LoanTransactionMapper");
class LoanController {
    getLoans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbContext = (0, DBConnection_1.createDbContext)();
            const loanService = new LoanService_1.LoanService(dbContext);
            const memberService = new MemberService_1.MemberService(dbContext);
            const logger = new logger_1.Logger();
            const memberId = req.params.memberid;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const offset = pageSize * (page - 1);
            const orderBy = req.query.orderBy ? req.query.orderBy : 'datecreated';
            const orderDir = req.query.orderDir ? req.query.orderDir : 'DESC';
            const search = req.query.search || '';
            const member = yield memberService.getMember(memberId);
            if (!member) {
                logger.infoLog('Member not found', 'getLoans');
                return res.status(404).send({ message: "Resource not found." });
            }
            const { count, data } = yield loanService.getLoans(search, pageSize, offset, orderBy, orderDir, 'memberid', member.memberid);
            const dto = new LoanMapper_1.LoanMapper().listMapper(data);
            res.header('x-count', count);
            return res.status(200).send(dto);
        });
    }
    getLoan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbContext = (0, DBConnection_1.createDbContext)();
            const loanId = req.params.loanid;
            const loanService = new LoanService_1.LoanService(dbContext);
            const loanTransactionService = new LoanTransactionService_1.LoanTransactionService(dbContext);
            const logger = new logger_1.Logger();
            const loan = yield loanService.getDetailById(loanId);
            if (!loan) {
                logger.infoLog('Loan not found', 'getLoan');
                return res.status(404).send({ message: "Resource not found." });
            }
            const txns = yield loanTransactionService.getTransactions(loan.loanid);
            const transactions = new LoanTransactionMapper_1.LoanTransactionMapper().listMapper(txns);
            const dto = new LoanMapper_1.LoanMapper().detailMapper(loan, transactions);
            return res.status(200).send(dto);
        });
    }
    calculateInterest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbContext = (0, DBConnection_1.createDbContext)();
            const loanId = req.params.loanid;
            const loanService = new LoanService_1.LoanService(dbContext);
            const loanTransactionService = new LoanTransactionService_1.LoanTransactionService(dbContext);
            const logger = new logger_1.Logger();
            const loan = yield loanService.getDetailById(loanId);
            if (!loan) {
                logger.infoLog('Loan not found', 'getLoan');
                return res.status(404).send({ message: "Resource not found." });
            }
            const txns = yield loanTransactionService.getTransactions(loan.loanid);
            const transactions = new LoanTransactionMapper_1.LoanTransactionMapper().listMapper(txns);
            const dto = new LoanMapper_1.LoanMapper().interestMapper(loan, transactions);
            return res.status(200).send(dto);
        });
    }
    addLoan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loanBody = req.body;
            const memberId = req.params.memberid;
            const dbContext = (0, DBConnection_1.createDbContext)();
            const loanService = new LoanService_1.LoanService(dbContext);
            const memberService = new MemberService_1.MemberService(dbContext);
            const logger = new logger_1.Logger();
            const member = yield memberService.getMember(memberId);
            if (!member) {
                logger.infoLog('Member not found', 'addLoan');
                return res.status(404).send({ message: "Resource not found." });
            }
            const model = new LoanMapper_1.LoanMapper().postMapper(loanBody, member.memberid);
            const loan = yield loanService.createLoan(model);
            return res.status(201).send({ id: loan.guid });
        });
    }
    updateLoan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loanBody = req.body;
            const loanId = req.params.loanid;
            const memberId = req.params.memberid;
            const dbContext = (0, DBConnection_1.createDbContext)();
            const loanService = new LoanService_1.LoanService(dbContext);
            const memberService = new MemberService_1.MemberService(dbContext);
            const logger = new logger_1.Logger();
            const member = yield memberService.getMember(memberId);
            if (!member) {
                logger.infoLog('Member not found', 'addLoan');
                return res.status(404).send({ message: "Resource not found." });
            }
            const model = new LoanMapper_1.LoanMapper().postMapper(loanBody, member.memberid);
            yield loanService.updateLoan(loanId, model);
            return res.status(204).send();
        });
    }
    deleteLoan(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loanId = req.params.loanid;
            const dbContext = (0, DBConnection_1.createDbContext)();
            const loanService = new LoanService_1.LoanService(dbContext);
            yield loanService.deleteLoan(loanId);
            return res.status(204).send();
        });
    }
}
exports.LoanController = LoanController;
//# sourceMappingURL=LoanController.js.map