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
    checkDays(loan, transactions) {
        var _a;
        const lastPaidDate = (_a = transactions[transactions.length - 1]) === null || _a === void 0 ? void 0 : _a.PaidDate;
        const currentDate = (0, moment_1.default)();
        const initialDate = (0, moment_1.default)(lastPaidDate ? lastPaidDate : loan.loantakendate);
        let noOfDays = currentDate.diff(initialDate, 'days');
        if (noOfDays == 0) {
            noOfDays = 0;
        }
        else {
            noOfDays = noOfDays + 1;
        }
        if (noOfDays > 90) {
            return true;
        }
        return false;
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
        else if (noOfDays < 0) {
            noOfDays = 0;
        }
        console.log('Days ', noOfDays);
        const noOfTimesCompounded = noOfDaysInYear / thresholdPeriod;
        const time_days = noOfDays / noOfDaysInYear;
        const compoundedAmount = amount * Math.pow(1 + (interestRate / noOfTimesCompounded), noOfTimesCompounded * time_days);
        const sumInterest = Math.round(compoundedAmount - amount);
        let tempNoofDays = noOfDays;
        let interestDetails = [];
        let compoundedAmountTemp = 0;
        let time_days_temp = 0;
        let sumInterestTemp = 0;
        while (tempNoofDays > 0) {
            if (tempNoofDays >= thresholdPeriod) {
                time_days_temp = thresholdPeriod / noOfDaysInYear;
                compoundedAmountTemp = amount * Math.pow(1 + (interestRate / noOfTimesCompounded), noOfTimesCompounded * time_days_temp);
                sumInterestTemp = Math.round(compoundedAmountTemp - amount);
                interestDetails.push({ ExceptedInterestAmount: sumInterestTemp, PaidDays: thresholdPeriod });
                tempNoofDays = tempNoofDays - thresholdPeriod;
            }
            else {
                time_days_temp = tempNoofDays / noOfDaysInYear;
                compoundedAmountTemp = amount * Math.pow(1 + (interestRate / noOfTimesCompounded), noOfTimesCompounded * time_days_temp);
                sumInterestTemp = Math.round(compoundedAmountTemp - amount);
                interestDetails.push({ ExceptedInterestAmount: sumInterestTemp, PaidDays: tempNoofDays });
                tempNoofDays = 0;
            }
        }
        if (paidamount > sumInterest) {
            return { interest: sumInterest, interestDetails, liableAmount: paidamount - sumInterest, dueAmount: 0 };
        }
        else if (paidamount == 0) {
            return { interest: sumInterest, interestDetails, dueAmount: sumInterest, liableAmount: 0 };
        }
        else {
            return { interest: sumInterest, interestDetails, dueAmount: sumInterest - paidamount, liableAmount: 0 };
        }
    }
    interestMapper(loan, transactions) {
        var _a;
        let dueAmountTotal = 0;
        let liableAmountTotal = 0;
        let paidInterestDetails = [];
        for (let i = 0; i < transactions.length; i++) {
            if (i == 0) {
                const { dueAmount, liableAmount, interestDetails } = this.interestCalculator(loan.amount, loan.loantakendate, transactions[i].PaidDate, transactions[i].PaidAmount);
                dueAmountTotal = dueAmountTotal + dueAmount;
                liableAmountTotal = liableAmountTotal + liableAmount;
                paidInterestDetails.push({ TransactionId: transactions[i].LoanTransactionId, interestDetails });
            }
            else {
                const { liableAmount, dueAmount, interestDetails } = this.interestCalculator(loan.amount, transactions[i - 1].PaidDate, transactions[i].PaidDate, transactions[i].PaidAmount);
                dueAmountTotal = dueAmountTotal + dueAmount;
                liableAmountTotal = liableAmountTotal + liableAmount;
                paidInterestDetails.push({ TransactionId: transactions[i].LoanTransactionId, interestDetails });
            }
        }
        const principleAmount = dueAmountTotal + loan.amount;
        const latestPaidDate = (_a = transactions[transactions.length - 1]) === null || _a === void 0 ? void 0 : _a.PaidDate;
        let I;
        let D;
        let now = new Date();
        if (now) {
            const year = new Date(now).getFullYear();
            const month = new Date(now).getMonth() + 1;
            const day = new Date(now).getDate();
            // steps
            // datepicker sends date with 00:00:00 and timezone kathmandu 
            // but in payload, it sends utc time by subtracting 5 hr:45 min which leads issue. date can be prev date
            //  inorder to fix it, i make 5:45
            // while making payload it makes utc time by subtracting 545. It makes sure date always selected date 
            // value = new Date(`${year}-${month}-${day} 05:45:00`);
            now = new Date(`${year}-${month}-${day} 06:15:00`);
        }
        if (transactions.length > 0) {
            const { interest, interestDetails } = this.interestCalculator(principleAmount, latestPaidDate, now, 0);
            I = interest;
            D = interestDetails;
        }
        else {
            const { interest, interestDetails } = this.interestCalculator(principleAmount, loan.loantakendate, now, 0);
            I = interest;
            D = interestDetails;
        }
        I = Math.round(I);
        dueAmountTotal = Math.round(dueAmountTotal);
        liableAmountTotal = Math.round(liableAmountTotal);
        const totalInterest = I + dueAmountTotal;
        const totalDueAmountRemaining = dueAmountTotal > 0 ? (dueAmountTotal > totalInterest ? dueAmountTotal - totalInterest : 0) : 0;
        const totalAdvancedAmount = liableAmountTotal > 0 ? (liableAmountTotal > totalInterest ? liableAmountTotal - totalInterest : 0) : 0;
        const totalInterestAmount = liableAmountTotal > 0 ? (totalInterest < liableAmountTotal ? 0 : totalInterest - liableAmountTotal) : totalInterest;
        // let daysThatLiableAmountApplies: any[] = [];
        // let totalDaysThatLiableAmountApplies_temp = 0;
        // if (transactions.length > 0 && liableAmountTotal) {
        //     let addDays = 0;
        //     let totalDaysThatLiableAmountApplies = 0;
        //     const thresholdPeriod = parseInt(process.env.LOAN_THRESHOLD_PERIOD);
        //     const interestRate = parseFloat(process.env.LOAN_INTEREST_RATE);
        //     const noOfDaysInYear = parseInt(process.env.NO_OF_DAYS_IN_YEAR);
        //     const noOfTimesCompounded = noOfDaysInYear / thresholdPeriod;
        //     totalDaysThatLiableAmountApplies = ((Math.log((loan.amount + liableAmountTotal) / loan.amount) / Math.log(1 + (interestRate / noOfTimesCompounded))) * noOfDaysInYear) / noOfTimesCompounded;
        //     totalDaysThatLiableAmountApplies = Math.round(totalDaysThatLiableAmountApplies);
        //     totalDaysThatLiableAmountApplies_temp = totalDaysThatLiableAmountApplies;
        //     while (totalDaysThatLiableAmountApplies > 0) {
        //         if (totalDaysThatLiableAmountApplies >= thresholdPeriod) {
        //             const time_days = thresholdPeriod / noOfDaysInYear;
        //             const compoundedAmount = loan.amount * Math.pow(1 + (interestRate / noOfTimesCompounded), noOfTimesCompounded * time_days)
        //             const sumInterest = Math.round(compoundedAmount - loan.amount);
        //             addDays = addDays + thresholdPeriod;
        //             daysThatLiableAmountApplies.push({
        //                 InterestAmount: sumInterest, Days: thresholdPeriod, Date: moment(latestPaidDate).add(addDays, 'days').format('YYYY-MM-DD')
        //             });
        //             totalDaysThatLiableAmountApplies = totalDaysThatLiableAmountApplies - thresholdPeriod;
        //         } else {
        //             const time_days = totalDaysThatLiableAmountApplies / noOfDaysInYear;
        //             const compoundedAmount = loan.amount * Math.pow(1 + (interestRate / noOfTimesCompounded), noOfTimesCompounded * time_days)
        //             const sumInterest = Math.round(compoundedAmount - loan.amount);
        //             addDays = addDays + totalDaysThatLiableAmountApplies;
        //             daysThatLiableAmountApplies.push({
        //                 InterestAmount: sumInterest, Days: totalDaysThatLiableAmountApplies, Date: moment(latestPaidDate).add(addDays, 'days').format('YYYY-MM-DD')
        //             });
        //             totalDaysThatLiableAmountApplies = 0;
        //         }
        //     }
        // }
        return {
            LoanId: loan.guid,
            Principle: Math.round(loan.amount),
            DueInterestAmount: dueAmountTotal,
            InterestDetails: D,
            LiableAmount: liableAmountTotal,
            InterestAmount: totalInterestAmount,
            LiableAmountRemaining: totalAdvancedAmount,
            DueInterestAmountRemaining: totalDueAmountRemaining,
            // DetailsofAdvancePaymentsToVoid: daysThatLiableAmountApplies,
            // NoofDaystoVoidAdvanceAmount: totalDaysThatLiableAmountApplies_temp,
            LatestPaidDate: latestPaidDate ? (0, moment_1.default)(latestPaidDate).format('YYYY-MM-DD') : null,
            LoanTakenDate: loan.loantakendate ? (0, moment_1.default)(loan.loantakendate).format('YYYY-MM-DD') : null,
            PreviouslyPaidInterest: Math.round(transactions.reduce((acc, curr) => acc + curr.PaidAmount, 0)),
            Transactions: transactions.map((t) => {
                const matchT = paidInterestDetails.find(pid => pid.TransactionId == t.LoanTransactionId);
                return {
                    PaidAmount: t.PaidAmount,
                    PaidDate: t.PaidDate,
                    Details: matchT ? matchT.interestDetails : [],
                    ExceptedTotalInterestAmount: matchT ? matchT.interestDetails.reduce((acc, curr) => acc + curr.ExceptedInterestAmount, 0) : 0
                };
            })
        };
    }
    mapLoanDataToHTML(data, firstname) {
        const html = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Loan Details</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 20px;
                            }
                            .loan-details {
                                max-width: 600px;
                                margin: 0 auto;
                                border: 1px solid #ddd;
                                padding: 20px;
                                border-radius: 5px;
                                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            }
                            .loan-details h1 {
                                text-align: center;
                                color: #333;
                            }
                            .loan-details dl {
                                display: flex;
                                flex-wrap: wrap;
                            }
                            .loan-details dt, .loan-details dd {
                                width: 50%;
                                margin: 0;
                                padding: 5px 0;
                            }
                            .loan-details dt {
                                font-weight: bold;
                                color: #555;
                            }
                            .loan-details dd {
                                color: #777;
                            }
                            .logo {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                        </style>
                    </head>
                    <body>

                    <div class="loan-details">
                        <div class="logo">
                            <img src="${process.env.API_URL}/logo.jpg" alt="Company Logo" style="max-width: 150px;">
                        </div>
                        <h1 style="color:blue;">Loan Details of ${firstname}</h1>
                        <dl>
                            <dt>Principle:</dt>
                            <dd id="principle">Rs ${data.Principle}</dd>
                            
                            <dt>Due Interest Amount:</dt>
                            <dd id="dueInterestAmount">Rs ${data.DueInterestAmountRemaining}</dd>
                            
                            <dt>Interest Amount:</dt>
                            <dd id="interestAmount">Rs ${data.InterestAmount}</dd>
                            
                            <dt>Advanced Amount:</dt>
                            <dd id="liableAmount">Rs ${data.LiableAmountRemaining}</dd>
                            
                            <dt>Latest Paid Date:</dt>
                            <dd id="latestPaidDate">${data.LatestPaidDate ? (0, moment_1.default)(data.LatestPaidDate).format('LL') : 'Not paid yet'}</dd>
                            
                            <dt>Loan Taken Date:</dt>
                            <dd id="loanTakenDate">${data.LoanTakenDate ? (0, moment_1.default)(data.LoanTakenDate).format('LL') : 'No date found'}</dd>
                            
                            <dt>Previously Paid Interest:</dt>
                            <dd id="previouslyPaidInterest"> Rs ${data.PreviouslyPaidInterest}</dd>

                            
                        </dl>
                    </div>

                    </body>
                    <footer style="text-align:right;margin-top:50px">Generated by <span style="color:blue;">PGROUP<span></footer>
                    </html>
                    `;
        return html;
    }
}
exports.LoanMapper = LoanMapper;
//# sourceMappingURL=LoanMapper.js.map