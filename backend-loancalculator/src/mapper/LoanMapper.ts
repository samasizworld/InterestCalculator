import moment from "moment";
import { LoanModel } from "../utils/Interfaces";

export class LoanMapper {
    listMapper(loans: LoanModel[]) {
        return loans.map(loan => {
            return {
                LoanId: loan.guid,
                Amount: loan.amount,
                IsAmountPaid: loan.isamountpaid,
                Loantakendate: loan.loantakendate,
                Datemodified: loan.datemodified,
            }
        })
    }

    detailMapper(loan: LoanModel, transactions: any[]) {
        return {
            LoanId: loan.guid,
            Amount: loan.amount,
            IsAmountPaid: loan.isamountpaid,
            Loantakendate: loan.loantakendate,
            Datemodified: loan.datemodified,
            Transactions: transactions ? transactions : []
        }
    }

    postMapper(payload: { Amount: number, LoanTakenDate: string }, memberid: number) {
        return {
            amount: payload.Amount,
            loantakendate: payload.LoanTakenDate,
            memberid: memberid
        }
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

    checkDays(loan: LoanModel, transactions: any[]) {
        const lastPaidDate = transactions[transactions.length - 1]?.PaidDate;
        const currentDate = moment();
        const initialDate = moment(lastPaidDate ? lastPaidDate : loan.loantakendate);
        let noOfDays = currentDate.diff(initialDate, 'days');
        if (noOfDays == 0) {
            noOfDays = 0;
        } else {
            noOfDays = noOfDays + 1;
        }
        if (noOfDays > 90) {
            return true;
        }
        return false;

    }

    interestMapper(loan: LoanModel, transactions: any[]) {
        let dueAmountTotal = 0;
        let liableAmountTotal = 0;
        for (let i = 0; i < transactions.length; i++) {
            if (i == 0) {
                const { dueAmount, liableAmount } = this.interestCalculator(loan.amount, loan.loantakendate, transactions[i].PaidDate, transactions[i].PaidAmount);
                dueAmountTotal = dueAmountTotal + dueAmount;
                liableAmountTotal = liableAmountTotal + liableAmount;
            } else {
                const { liableAmount, dueAmount } = this.interestCalculator(loan.amount, transactions[i - 1].PaidDate, transactions[i].PaidDate, transactions[i].PaidAmount);
                dueAmountTotal = dueAmountTotal + dueAmount;
                liableAmountTotal = liableAmountTotal + liableAmount;
            }
        }

        const principleAmount = dueAmountTotal + loan.amount;
        const latestPaidDate = transactions[transactions.length - 1]?.PaidDate;
        console.log('Latest Paid date ', latestPaidDate);
        let I: any;
        if (transactions.length > 0) {
            const { interest } = this.interestCalculator(principleAmount, latestPaidDate, new Date(), 0);
            I = interest;
        } else {
            const { interest } = this.interestCalculator(principleAmount, loan.loantakendate, new Date(), 0);
            I = interest;
        }

        // let date;
        // let dayss;
        // if (transactions.length > 0 && liableAmountTotal) {
        //     dayss = ((Math.log((loan.amount + liableAmountTotal) / loan.amount) / Math.log(1 + (0.1 / 4.06))) * 365) / 4.06;
        //     dayss = Math.ceil(dayss)
        //     date = moment(latestPaidDate).add(dayss, 'days').format('YYYY-MM-DD');
        // }

        return {
            LoanId: loan.guid,
            Principle: Math.round(loan.amount),
            DueInterestAmount: Math.round(dueAmountTotal),
            InterestAmount: Math.round(I),
            LiableAmount: Math.round(liableAmountTotal),
            // DatetoVoidLiableAmount: date,
            // NoofDaystoVoid: dayss,
            LatestPaidDate: latestPaidDate ? moment(latestPaidDate).format('YYYY-MM-DD') : null,
            LoanTakenDate: loan.loantakendate ? moment(loan.loantakendate).format('YYYY-MM-DD') : null,
            // InterestAmount: liableAmountTotal > 0 ? (I < liableAmountTotal ? 0 : liableAmountTotal - I) : I,
            // LiableAmount: liableAmountTotal > 0 ? (liableAmountTotal > I ? liableAmountTotal - I : 0) : 0,
            PreviouslyPaidInterest: Math.round(transactions.reduce((acc, curr) => acc + curr.PaidAmount, 0))
        }

    }
    interestCalculator(amount: any, loantakendate: any, paiddate: any, paidamount: any) {
        const currentDate = moment(paiddate);
        const initialDate = moment(loantakendate);
        const thresholdPeriod = parseInt(process.env.LOAN_THRESHOLD_PERIOD);
        const interestRate = parseFloat(process.env.LOAN_INTEREST_RATE);
        const noOfDaysInYear = parseInt(process.env.NO_OF_DAYS_IN_YEAR);
        let noOfDays = currentDate.diff(initialDate, 'days');
        if (noOfDays == 0) {
            noOfDays = 0;
        } else {
            noOfDays = noOfDays + 1;
        }
        console.log('Days ', noOfDays);
        const noOfTimesCompounded = noOfDaysInYear / thresholdPeriod;
        const time_days = noOfDays / noOfDaysInYear;
        const compoundedAmount = amount * Math.pow(1 + (interestRate / noOfTimesCompounded), noOfTimesCompounded * time_days)
        const sumInterest = Math.round(compoundedAmount - amount);
        if (paidamount > sumInterest) {
            return { interest: sumInterest, liableAmount: paidamount - sumInterest, dueAmount: 0 };
        } else if (paidamount == 0) {
            return { interest: sumInterest, dueAmount: sumInterest, liableAmount: 0 };
        } else {
            return { interest: sumInterest, dueAmount: sumInterest - paidamount, liableAmount: 0 };
        }
    }


    mapLoanDataToHTML(data: any, firstname: string) {
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
                            <dd id="dueInterestAmount">Rs ${data.DueInterestAmount}</dd>
                            
                            <dt>Interest Amount:</dt>
                            <dd id="interestAmount">Rs ${data.InterestAmount}</dd>
                            
                            <dt>Advanced Amount:</dt>
                            <dd id="liableAmount">Rs ${data.LiableAmount}</dd>
                            
                            <dt>Latest Paid Date:</dt>
                            <dd id="latestPaidDate">${data.LatestPaidDate ? moment(data.LatestPaidDate).format('LL') : 'Not paid yet'}</dd>
                            
                            <dt>Loan Taken Date:</dt>
                            <dd id="loanTakenDate">${data.LoanTakenDate ? moment(data.LoanTakenDate).format('LL') : 'No date found'}</dd>
                            
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