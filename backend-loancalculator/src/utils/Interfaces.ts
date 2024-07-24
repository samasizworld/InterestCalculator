import { Model } from "sequelize";

export enum InterestorPrincipal {
    interest = 'interest',
    principal = 'principal'
}


// initializing interface for type checking
export interface MemberAttributes {
    memberid?: number;
    guid?: string;
    firstname: string;
    middlename: string;
    lastname: string;
    emailaddress: string;
    datecreated?: Date;
    datemodified?: Date;
    datedeleted?: Date;
}

export interface MemberModel extends Model<MemberAttributes>, MemberAttributes { }


// initializing interface for type checking
export interface LoanAttributes {
    loanid?: number;
    guid?: string;
    memberid: number;
    amount: number;
    isamountpaid: boolean;
    loantakendate: Date;
    datecreated?: Date;
    datemodified?: Date;
    datedeleted?: Date;
}

export interface LoanModel extends Model<LoanAttributes>, LoanAttributes { }



// initializing interface for type checking
export interface LoanTransactionAttributes {
    loantransactionid?: number;
    guid?: string;
    loanid: number;
    paidamount: number;
    paiddate: Date;
    paidtype: InterestorPrincipal;
    datecreated?: Date;
    datemodified?: Date;
    datedeleted?: Date;
}

export interface LoanTransactionModel extends Model<LoanTransactionAttributes>, LoanTransactionAttributes { }