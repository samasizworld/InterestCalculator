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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const pdfGenerator_1 = require("../utils/pdfGenerator");
const moment_1 = __importDefault(require("moment"));
const enums_1 = require("../utils/enums");
const MessageService_1 = require("../services/MessageService");
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
            const intrest = new LoanMapper_1.LoanMapper().interestMapper(loan, transactions);
            dto.AdvancedInterestRemaining = intrest.LiableAmountRemaining;
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
    checkAndSendMailToThoseWhoHaventPaidMoreThan90days() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbContext = (0, DBConnection_1.createDbContext)();
            const loanService = new LoanService_1.LoanService(dbContext);
            const memberService = new MemberService_1.MemberService(dbContext);
            const messageService = new MessageService_1.MessageService(dbContext);
            const { data } = yield loanService.getLoans('', 0, 0, 'loanid', 'ASC');
            const logger = new logger_1.Logger();
            for (const loan of data) {
                const loanTransactionService = new LoanTransactionService_1.LoanTransactionService(dbContext);
                if (!loan) {
                    logger.infoLog('Loan not found', 'checkAndSendMailToThoseWhoHaventPaidMoreThan90days');
                    continue;
                }
                const member = yield memberService.getMemberByIntegerId(loan.memberid);
                if (!member) {
                    logger.infoLog('Member not found', 'checkAndSendMailToThoseWhoHaventPaidMoreThan90days');
                    continue;
                }
                const txns = yield loanTransactionService.getTransactions(loan.loanid);
                const transactions = new LoanTransactionMapper_1.LoanTransactionMapper().listMapper(txns);
                const check = new LoanMapper_1.LoanMapper().checkDays(loan, transactions);
                if (check == true) {
                    const model = {
                        recipientemailaddress: member.emailaddress, body: enums_1.messageTemplates["loanpaymentreminder"].body.replace('{firstname}', member.firstname), subject: enums_1.messageTemplates["loanpaymentreminder"].subject
                    };
                    yield messageService.addMessage(model);
                }
            }
        });
    }
    downloadLoanPDF(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbContext = (0, DBConnection_1.createDbContext)();
            const loanId = req.params.loanid;
            const loanService = new LoanService_1.LoanService(dbContext);
            const loanTransactionService = new LoanTransactionService_1.LoanTransactionService(dbContext);
            const memberService = new MemberService_1.MemberService(dbContext);
            const logger = new logger_1.Logger();
            const loan = yield loanService.getDetailById(loanId);
            if (!loan) {
                logger.infoLog('Loan not found', 'getLoan');
                return res.status(404).send({ message: "Resource not found." });
            }
            const member = yield memberService.getMemberByIntegerId(loan.memberid);
            const txns = yield loanTransactionService.getTransactions(loan.loanid);
            const transactions = new LoanTransactionMapper_1.LoanTransactionMapper().listMapper(txns);
            const dto = new LoanMapper_1.LoanMapper().interestMapper(loan, transactions);
            const html = new LoanMapper_1.LoanMapper().mapLoanDataToHTML(dto, member.firstname);
            const pdfBuffer = yield (0, pdfGenerator_1.pdfGenerateByHtml)(html);
            let datetime = (0, moment_1.default)().format('YYYYMMDD_HHmmss');
            let filename = `${member.firstname}` + '_loan_' + datetime + ".pdf";
            res.writeHead(200, {
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Type": 'application/pdf',
            });
            return res.status(200).end(pdfBuffer);
        });
    }
    sendMemberAEmailWithLoanInterestPaymentDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbContext = (0, DBConnection_1.createDbContext)();
            const loanId = req.params.loanid;
            const loanService = new LoanService_1.LoanService(dbContext);
            const loanTransactionService = new LoanTransactionService_1.LoanTransactionService(dbContext);
            const memberService = new MemberService_1.MemberService(dbContext);
            const messageService = new MessageService_1.MessageService(dbContext);
            const logger = new logger_1.Logger();
            const loan = yield loanService.getDetailById(loanId);
            if (!loan) {
                logger.infoLog('Loan not found', 'sendMemberAEmailWithLoanInterestPaymentDetail');
                return res.status(404).send({ message: "Resource not found." });
            }
            const member = yield memberService.getMemberByIntegerId(loan.memberid);
            const txns = yield loanTransactionService.getTransactions(loan.loanid);
            const transactions = new LoanTransactionMapper_1.LoanTransactionMapper().listMapper(txns);
            const dto = new LoanMapper_1.LoanMapper().interestMapper(loan, transactions);
            const html = new LoanMapper_1.LoanMapper().mapLoanDataToHTML(dto, member.firstname);
            const pdfBuffer = yield (0, pdfGenerator_1.pdfGenerateByHtml)(html);
            let datetime = (0, moment_1.default)().format('YYYYMMDD_HHmmss');
            let filename = `${member.firstname}` + '_loan_' + datetime + ".pdf";
            const attachments = [{
                    filename: filename,
                    content: pdfBuffer.toString('base64'),
                    encoding: 'base64'
                }];
            const model = {
                recipientemailaddress: member.emailaddress, body: enums_1.messageTemplates["loanpaymentdetail"].body.replace('{firstname}', member.firstname), subject: enums_1.messageTemplates["loanpaymentdetail"].subject, attachments
            };
            yield messageService.addMessage(model);
            return res.status(200).send({ message: `Email ${member.emailaddress} added to MQ.` });
        });
    }
}
exports.LoanController = LoanController;
//# sourceMappingURL=LoanController.js.map