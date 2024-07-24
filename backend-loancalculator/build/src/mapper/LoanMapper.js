"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanMapper = void 0;
const moment_1 = __importDefault(require("moment"));
class LoanMapper {
    listMapper(loans) {
        return loans.map(loan => {
            return {
                LoanId: loan.guid,
                Amount: loan.amount,
                IsAmountPaid: loan.isamountpaid,
                Loantakendate: loan.loantakendate,
                Datemodified: loan.datemodified,
            };
        });
    }
    detailMapper(loan, transactions) {
        return {
            LoanId: loan.guid,
            Amount: loan.amount,
            IsAmountPaid: loan.isamountpaid,
            Loantakendate: loan.loantakendate,
            Datemodified: loan.datemodified,
            Transactions: transactions ? transactions : []
        };
    }
    postMapper(payload, memberid) {
        return {
            amount: payload.Amount,
            loantakendate: payload.LoanTakenDate,
            memberid: memberid
        };
    }
    // interestMapper(loan: LoanModel, transactions: any[]) {
    //     const amount = parseFloat(loan.amount as any);
    //     let dueAmountTotal = 0;
    //     let liableAmountTotal = 0;
    //     for (let i = 0; i < transactions.length; i++) {
    //         if (i == 0) {
    //             const { dueAmount, liableAmount } = this.interestCalculator(amount, loan.loantakendate, transactions[i].PaidDate, transactions[i].PaidAmount);
    //             dueAmountTotal = dueAmountTotal + dueAmount;
    //             liableAmountTotal = liableAmount + liableAmount;
    //         } else {
    //             const { liableAmount, dueAmount } = this.interestCalculator(amount, transactions[i - 1].PaidDate, transactions[i].PaidDate, transactions[i].PaidAmount);
    //             dueAmountTotal = dueAmountTotal + dueAmount;
    //             liableAmountTotal = liableAmount + liableAmount;
    //         }
    //     }
    //     const principleAmount = dueAmountTotal + amount;
    //     const latestPaidDate = transactions[transactions.length - 1]?.PaidDate;
    //     console.log(latestPaidDate);
    //     let I: any;
    //     if (transactions.length > 0) {
    //         const { interest } = this.interestCalculator(principleAmount, latestPaidDate, new Date(), 0);
    //         I = interest;
    //     } else {
    //         const { interest } = this.interestCalculator(principleAmount, loan.loantakendate, new Date(), 0);
    //         I = interest;
    //     }
    //     return {
    //         LoanId: loan.guid,
    //         Principle: amount,
    //         DueInterestAmount: Math.ceil(dueAmountTotal),
    //         InterestAmount: Math.ceil(I),
    //         LiableAmount: Math.ceil(liableAmountTotal),
    //         PreviouslyPaidInterest: transactions.reduce((acc, curr) => acc + parseFloat(curr.PaidAmount), 0)
    //     }
    // }
    // interestCalculator(amount: any, loantakendate: any, paiddate: any, paidamount: any) {
    //     let interest = 0;
    //     let sumInterest = 0;
    //     const currentDate = moment(paiddate);
    //     const initialDate = moment(loantakendate);
    //     const thresholdPeriod = parseInt(process.env.LOAN_THRESHOLD_PERIOD);
    //     let noOfDays = currentDate.diff(initialDate, 'days');
    //     if (noOfDays == 0) {
    //         noOfDays = 0;
    //     } else {
    //         noOfDays = noOfDays + 1;
    //     }
    //     console.log('Days ', noOfDays);
    //     paidamount = parseFloat(paidamount);
    //     // calculate compound interest
    //     while (noOfDays > 0) {
    //         if (noOfDays >= thresholdPeriod) {
    //             interest = ((interest + amount) * thresholdPeriod * 0.1) / 365;
    //             sumInterest = sumInterest + interest;
    //             noOfDays = noOfDays - thresholdPeriod;
    //         } else {
    //             interest = ((interest + amount) * noOfDays * 0.1) / 365;
    //             sumInterest = sumInterest + interest;
    //             noOfDays = 0;
    //         }
    //     }
    //     sumInterest = Math.ceil(sumInterest);
    //     if (paidamount > sumInterest) {
    //         return { amount, interest: sumInterest, liableAmount: paidamount - sumInterest, dueAmount: 0 };
    //     } else if (paidamount == 0) {
    //         return { amount, interest: sumInterest, dueAmount: sumInterest, liableAmount: 0 };
    //     } else {
    //         return { amount, interest: sumInterest, dueAmount: sumInterest - paidamount, liableAmount: 0 };
    //     }
    // }
    interestMapper(loan, transactions) {
        var _a;
        const amount = parseFloat(loan.amount);
        let dueAmountTotal = 0;
        let liableAmountTotal = 0;
        for (let i = 0; i < transactions.length; i++) {
            if (i == 0) {
                const { dueAmount, liableAmount } = this.interestCalculator(amount, loan.loantakendate, transactions[i].PaidDate, transactions[i].PaidAmount);
                dueAmountTotal = dueAmountTotal + dueAmount;
                liableAmountTotal = liableAmountTotal + liableAmount;
            }
            else {
                const { liableAmount, dueAmount } = this.interestCalculator(amount, transactions[i - 1].PaidDate, transactions[i].PaidDate, transactions[i].PaidAmount);
                dueAmountTotal = dueAmountTotal + dueAmount;
                liableAmountTotal = liableAmountTotal + liableAmount;
            }
        }
        const principleAmount = dueAmountTotal + amount;
        const latestPaidDate = (_a = transactions[transactions.length - 1]) === null || _a === void 0 ? void 0 : _a.PaidDate;
        console.log('Latest Paid date ', latestPaidDate);
        let I;
        if (transactions.length > 0) {
            const { interest } = this.interestCalculator(principleAmount, latestPaidDate, new Date(), 0);
            I = interest;
        }
        else {
            const { interest } = this.interestCalculator(principleAmount, loan.loantakendate, new Date(), 0);
            I = interest;
        }
        I = Math.ceil(I);
        dueAmountTotal = Math.ceil(dueAmountTotal);
        liableAmountTotal = Math.ceil(liableAmountTotal);
        let date;
        let dayss;
        if (transactions.length > 0 && liableAmountTotal) {
            dayss = ((Math.log((amount + liableAmountTotal) / amount) / Math.log(1 + (0.1 / 4.06))) * 365) / 4.06;
            dayss = Math.ceil(dayss);
            date = (0, moment_1.default)(latestPaidDate).add(dayss, 'days').format('YYYY-MM-DD');
        }
        return {
            LoanId: loan.guid,
            Principle: amount,
            DueInterestAmount: dueAmountTotal,
            InterestAmount: I,
            LiableAmount: liableAmountTotal,
            DatetoVoidLiableAmount: date,
            NoofDaystoVoid: dayss,
            LatestPaidDate: (0, moment_1.default)(latestPaidDate).format('YYYY-MM-DD'),
            // InterestAmount: liableAmountTotal > 0 ? (I < liableAmountTotal ? 0 : liableAmountTotal - I) : I,
            // LiableAmount: liableAmountTotal > 0 ? (liableAmountTotal > I ? liableAmountTotal - I : 0) : 0,
            PreviouslyPaidInterest: transactions.reduce((acc, curr) => acc + parseFloat(curr.PaidAmount), 0)
        };
    }
    interestCalculator(amount, loantakendate, paiddate, paidamount) {
        const currentDate = (0, moment_1.default)(paiddate);
        const initialDate = (0, moment_1.default)(loantakendate);
        const thresholdPeriod = parseInt(process.env.LOAN_THRESHOLD_PERIOD);
        const interestRate = parseFloat(process.env.LOAN_INTEREST_RATE);
        const noOfDaysInYear = parseInt(process.env.NO_OF_DAYS_IN_YEAR);
        let noOfDays = currentDate.diff(initialDate, 'days');
        if (noOfDays == 0) {
            noOfDays = 0;
        }
        else {
            noOfDays = noOfDays + 1;
        }
        console.log('Days ', noOfDays);
        paidamount = parseFloat(paidamount);
        const noOfTimesCompounded = noOfDaysInYear / thresholdPeriod;
        const time_days = noOfDays / noOfDaysInYear;
        const compoundedAmount = amount * Math.pow(1 + (interestRate / noOfTimesCompounded), noOfTimesCompounded * time_days);
        const sumInterest = Math.ceil(compoundedAmount - amount);
        if (paidamount > sumInterest) {
            return { interest: sumInterest, liableAmount: paidamount - sumInterest, dueAmount: 0 };
        }
        else if (paidamount == 0) {
            return { interest: sumInterest, dueAmount: sumInterest, liableAmount: 0 };
        }
        else {
            return { interest: sumInterest, dueAmount: sumInterest - paidamount, liableAmount: 0 };
        }
    }
}
exports.LoanMapper = LoanMapper;
//# sourceMappingURL=LoanMapper.js.map