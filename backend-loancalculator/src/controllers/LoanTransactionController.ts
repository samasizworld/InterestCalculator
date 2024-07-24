import { Request, Response } from "express";
import { createDbContext } from "../connection/DBConnection";
import { LoanService } from "../services/LoanService";
import { LoanMapper } from "../mapper/LoanMapper";
import { Logger } from "../utils/logger";
import { LoanTransactionService } from "../services/LoanTransactionService";
import { LoanTransactionMapper } from "../mapper/LoanTransactionMapper";

export class LoanTransactionController {

    async addLoanTransaction(req: Request, res: Response) {
        const loanTransactionBody = req.body;
        const dbContext = createDbContext();
        const loanTransactionService = new LoanTransactionService(dbContext);
        const loanService = new LoanService(dbContext);
        const logger = new Logger();
        const txnModel: any = new LoanTransactionMapper().postMapper(loanTransactionBody);
        if (txnModel.paidamount <= 0) {
            logger.infoLog('Paid Amount cannot be 0 or less.', 'addLoanTransaction');
            return res.status(400).send({ message: "Paid Amount cannot be 0 or less." });
        }
        const loan = await loanService.getLoan(loanTransactionBody.LoanId);
        if (!loan) {
            logger.infoLog('Loan not found', 'addLoanTransaction');
            return res.status(404).send({ message: "Resource not found." });
        }
        const txns = await loanTransactionService.getTransactions(loan.loanid);
        const transactions = new LoanTransactionMapper().listMapper(txns);
        const latestPaidDate = transactions[transactions.length - 1]?.PaidDate;
        let I;
        if (transactions.length > 0) {
            const { interest } = new LoanMapper().interestCalculator(parseFloat(loan.amount as any), latestPaidDate, new Date(), 0);
            I = Math.ceil(interest);
        } else {
            const { interest } = new LoanMapper().interestCalculator(parseFloat(loan.amount as any), loan.loantakendate, new Date(), 0);
            I = Math.ceil(interest);
        }
        // if (I == 0) {
        //     return res.status(403).send({ message: `No interest applicable atm.` })
        // } else if (I === txnModel.paidamount) {
        txnModel.loanid = loan.loanid;
        const t = await loanTransactionService.createLoanTransaction(txnModel);
        return res.status(201).send({ id: t.guid });
        // } else {
        //     return res.status(403).send({ message: `Please enter exact interest ${I}.` })
        // }
    }

    async updateLoanTransaction(req: Request, res: Response) {
        const loanTransactionBody = req.body;
        const transactionId = req.params.loantransactionid;
        const dbContext = createDbContext();
        const loanTransactionService = new LoanTransactionService(dbContext);
        const loanService = new LoanService(dbContext);
        const logger = new Logger();
        const txnModel: any = new LoanTransactionMapper().postMapper(loanTransactionBody);
        if (txnModel.paidamount <= 0) {
            logger.infoLog('Paid Amount cannot be 0 or less.', 'updateLoanTransaction');
            return res.status(400).send({ message: "Paid Amount cannot be 0 or less." });
        }
        const loan = await loanService.getLoan(loanTransactionBody.LoanId);
        if (!loan) {
            logger.infoLog('Loan not found', 'updateLoanTransaction');
            return res.status(404).send({ message: "Resource not found." });
        }
        const txns = await loanTransactionService.getTransactions(loan.loanid);
        const transactions = new LoanTransactionMapper().listMapper(txns);
        const currentTransaction = transactions.find(t => t.LoanTransactionId == transactionId);

        if (!currentTransaction) {
            logger.infoLog('LoanTransaction not found', 'updateLoanTransaction');
            return res.status(404).send({ message: "Resource not found." });
        }

        // const currentPaidDate = currentTransaction?.PaidDate;
        // const { interest } = new LoanMapper().interestCalculator(parseFloat(loan.amount as any), currentPaidDate, new Date(), 0);
        const t = await loanTransactionService.updateLoanTransaction(transactionId, txnModel);
        return res.status(201).send({ id: t.guid });

    }

    async deleteLoanTransaction(req: Request, res: Response) {
        const transactionId = req.params.loantransactionid;
        const dbContext = createDbContext();
        const loanTransactionService = new LoanTransactionService(dbContext);
        await loanTransactionService.deleteLoanTransaction(transactionId);
        return res.status(204).send();
    }
}