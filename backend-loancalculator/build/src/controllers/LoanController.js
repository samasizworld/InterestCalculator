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
const mailSender_1 = require("../utils/mailSender");
const pdfGenerator_1 = require("../utils/pdfGenerator");
const moment_1 = __importDefault(require("moment"));
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
            const { data } = yield loanService.getLoans('', 0, 0, 'loanid', 'ASC');
            const logger = new logger_1.Logger();
            for (const loan of data) {
                const loanTransactionService = new LoanTransactionService_1.LoanTransactionService(dbContext);
                if (!loan) {
                    logger.infoLog('Loan not found', 'checkAndSendMailToThoseWhoHaventPaidMoreThan90days');
                }
                const member = yield memberService.getMemberByIntegerId(loan.memberid);
                const txns = yield loanTransactionService.getTransactions(loan.loanid);
                const transactions = new LoanTransactionMapper_1.LoanTransactionMapper().listMapper(txns);
                const check = new LoanMapper_1.LoanMapper().checkDays(loan, transactions);
                if (check == true) {
                    yield (0, mailSender_1.sendMailTo)(member.emailaddress, `<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Reminder</title>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f8f8f8;
                    margin: 0;
                    padding: 20px;
                    }
                    .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 20px;
                    }
                    .content {
                    font-size: 16px;
                    color: #555;
                    }
                    .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #777;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <div class="header">Payment Reminder</div>
                    <div class="content">
                    <p>Hi <strong>${member.firstname}</strong>,</p>
                    <p>You haven't paid interest since 90 days. Please contact P Group loan committee member for more info.</p>
                    <p>Thank you.</p>
                    </div>
                    <div class="footer">
                    <p>P Group Loan Committee</p>
                    </div>
                </div>
                </body>
                </html>`, 'Payment reminder');
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
}
exports.LoanController = LoanController;
//# sourceMappingURL=LoanController.js.map