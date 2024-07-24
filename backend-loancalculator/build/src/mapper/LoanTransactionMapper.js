"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanTransactionMapper = void 0;
class LoanTransactionMapper {
    listMapper(loantxns) {
        return loantxns.map(loantxns => {
            return {
                LoanTransactionId: loantxns.guid,
                PaidAmount: loantxns.paidamount,
                PaidType: loantxns.paidtype,
                PaidDate: loantxns.paiddate,
                Datemodified: loantxns.datemodified
            };
        });
    }
    detailMapper(loantxns) {
        return {
            LoanTransactionId: loantxns.guid,
            PaidAmount: loantxns.paidamount,
            PaidType: loantxns.paidtype,
            PaidDate: loantxns.paiddate,
            Datemodified: loantxns.datemodified
        };
    }
    postMapper(payload) {
        return {
            paidamount: parseFloat(payload.PaidAmount),
            paiddate: payload.PaidDate,
            paidtype: payload.PaidType,
        };
    }
}
exports.LoanTransactionMapper = LoanTransactionMapper;
//# sourceMappingURL=LoanTransactionMapper.js.map