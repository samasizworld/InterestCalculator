import { LoanTransactionModel } from "../utils/Interfaces";

export class LoanTransactionMapper {
    listMapper(loantxns: LoanTransactionModel[]) {
        return loantxns.map(loantxns => {
            return {
                LoanTransactionId: loantxns.guid,
                PaidAmount: loantxns.paidamount,
                PaidType: loantxns.paidtype,
                PaidDate: loantxns.paiddate,
                Datemodified: loantxns.datemodified
            }
        })
    }

    detailMapper(loantxns: LoanTransactionModel) {
        return {
            LoanTransactionId: loantxns.guid,
            PaidAmount: loantxns.paidamount,
            PaidType: loantxns.paidtype,
            PaidDate: loantxns.paiddate,
            Datemodified: loantxns.datemodified
        }
    }

    postMapper(payload: { PaidAmount: number, PaidDate: string, PaidType: string }) {
        return {
            paidamount: parseFloat(payload.PaidAmount as any),
            paiddate: payload.PaidDate,
            paidtype: payload.PaidType,
        }
    }
}