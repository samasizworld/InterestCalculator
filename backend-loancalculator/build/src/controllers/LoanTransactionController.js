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
exports.LoanTransactionController = void 0;
const DBConnection_1 = require("../connection/DBConnection");
const LoanService_1 = require("../services/LoanService");
const LoanMapper_1 = require("../mapper/LoanMapper");
const logger_1 = require("../utils/logger");
const LoanTransactionService_1 = require("../services/LoanTransactionService");
const LoanTransactionMapper_1 = require("../mapper/LoanTransactionMapper");
class LoanTransactionController {
    addLoanTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const loanTransactionBody = req.body;
            const dbContext = (0, DBConnection_1.createDbContext)();
            const loanTransactionService = new LoanTransactionService_1.LoanTransactionService(dbContext);
            const loanService = new LoanService_1.LoanService(dbContext);
            const logger = new logger_1.Logger();
            const txnModel = new LoanTransactionMapper_1.LoanTransactionMapper().postMapper(loanTransactionBody);
            if (txnModel.paidamount <= 0) {
                logger.infoLog('Paid Amount cannot be 0 or less.', 'addLoanTransaction');
                return res.status(400).send({ message: "Paid Amount cannot be 0 or less." });
            }
            const loan = yield loanService.getLoan(loanTransactionBody.LoanId);
            if (!loan) {
                logger.infoLog('Loan not found', 'addLoanTransaction');
                return res.status(404).send({ message: "Resource not found." });
            }
            const txns = yield loanTransactionService.getTransactions(loan.loanid);
            const transactions = new LoanTransactionMapper_1.LoanTransactionMapper().listMapper(txns);
            const latestPaidDate = (_a = transactions[transactions.length - 1]) === null || _a === void 0 ? void 0 : _a.PaidDate;
            let I;
            if (transactions.length > 0) {
                const { interest } = new LoanMapper_1.LoanMapper().interestCalculator(parseFloat(loan.amount), latestPaidDate, new Date(), 0);
                I = Math.ceil(interest);
            }
            else {
                const { interest } = new LoanMapper_1.LoanMapper().interestCalculator(parseFloat(loan.amount), loan.loantakendate, new Date(), 0);
                I = Math.ceil(interest);
            }
            // if (I == 0) {
            //     return res.status(403).send({ message: `No interest applicable atm.` })
            // } else if (I === txnModel.paidamount) {
            txnModel.loanid = loan.loanid;
            const t = yield loanTransactionService.createLoanTransaction(txnModel);
            return res.status(201).send({ id: t.guid });
            // } else {
            //     return res.status(403).send({ message: `Please enter exact interest ${I}.` })
            // }
        });
    }
    updateLoanTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loanTransactionBody = req.body;
            const transactionId = req.params.loantransactionid;
            const dbContext = (0, DBConnection_1.createDbContext)();
            const loanTransactionService = new LoanTransactionService_1.LoanTransactionService(dbContext);
            const loanService = new LoanService_1.LoanService(dbContext);
            const logger = new logger_1.Logger();
            const txnModel = new LoanTransactionMapper_1.LoanTransactionMapper().postMapper(loanTransactionBody);
            if (txnModel.paidamount <= 0) {
                logger.infoLog('Paid Amount cannot be 0 or less.', 'updateLoanTransaction');
                return res.status(400).send({ message: "Paid Amount cannot be 0 or less." });
            }
            const loan = yield loanService.getLoan(loanTransactionBody.LoanId);
            if (!loan) {
                logger.infoLog('Loan not found', 'updateLoanTransaction');
                return res.status(404).send({ message: "Resource not found." });
            }
            const txns = yield loanTransactionService.getTransactions(loan.loanid);
            const transactions = new LoanTransactionMapper_1.LoanTransactionMapper().listMapper(txns);
            const currentTransaction = transactions.find(t => t.LoanTransactionId == transactionId);
            if (!currentTransaction) {
                logger.infoLog('LoanTransaction not found', 'updateLoanTransaction');
                return res.status(404).send({ message: "Resource not found." });
            }
            // const currentPaidDate = currentTransaction?.PaidDate;
            // const { interest } = new LoanMapper().interestCalculator(parseFloat(loan.amount as any), currentPaidDate, new Date(), 0);
            const t = yield loanTransactionService.updateLoanTransaction(transactionId, txnModel);
            return res.status(201).send({ id: t.guid });
        });
    }
    deleteLoanTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactionId = req.params.loantransactionid;
            const dbContext = (0, DBConnection_1.createDbContext)();
            const loanTransactionService = new LoanTransactionService_1.LoanTransactionService(dbContext);
            yield loanTransactionService.deleteLoanTransaction(transactionId);
            return res.status(204).send();
        });
    }
}
exports.LoanTransactionController = LoanTransactionController;
//# sourceMappingURL=LoanTransactionController.js.map