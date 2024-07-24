import express, { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import http from 'http';
import cors from 'cors';
import { asyncHandler } from './src/middleware/errorMiddleware';
import { PingController } from './src/controllers/PingController';
import { initVault } from './src/connection/VaultConnection';
import { sequelizeConnect } from './src/connection/DBConnection';
import { MemberController } from './src/controllers/MemberController';
import { Logger } from './src/utils/logger';
import { LoanController } from './src/controllers/LoanController';
import { LoanTransactionController } from './src/controllers/LoanTransactionController';
config({ path: "./.env" });

// init vault
initVault().then(() => {
    // connect to the database
    sequelizeConnect();

    const router = express.Router();
    const app = express();
    const server = http.createServer(app);

    // port initialize
    server.listen(process.env.APP_PORT, () => { console.log(`Server listening in PORT ${process.env.APP_PORT}`) });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        "origin": "*",
        "allowedHeaders": "*",
        "exposedHeaders": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
    }));
    app.use('/', router);
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        const logger = new Logger();
        logger.errorLog(error, req.originalUrl);
        return res.status(500).send({ message: 'Something went wrong.' });
    });

    //  not found middleware
    app.use((req: Request, res: Response, next: NextFunction) => {
        return res.status(404).send({ message: `Page at ${req.originalUrl} is not found` });
    });
    // Just for ping
    router.get('/ping/:anything?', asyncHandler((req: Request, res: Response) => {
        return new PingController().ping(req, res);
    }));

    // Members route
    router.get('/api/v1/members', asyncHandler((req: Request, res: Response) => {
        return new MemberController().getMembers(req, res);
    }));

    router.get('/api/v1/members/:memberid', asyncHandler((req: Request, res: Response) => {
        return new MemberController().getMember(req, res);
    }));

    router.post('/api/v1/members', asyncHandler((req: Request, res: Response) => {
        return new MemberController().addMember(req, res);
    }));

    router.put('/api/v1/members/:memberid', asyncHandler((req: Request, res: Response) => {
        return new MemberController().updateMember(req, res);
    }));

    router.delete('/api/v1/members/:memberid', asyncHandler((req: Request, res: Response) => {
        return new MemberController().deleteMember(req, res);
    }));

    // Loans route
    router.get('/api/v1/members/:memberid/loans', asyncHandler((req: Request, res: Response) => {
        return new LoanController().getLoans(req, res);
    }));

    router.get('/api/v1/members/:memberid/loans/:loanid', asyncHandler((req: Request, res: Response) => {
        return new LoanController().getLoan(req, res);
    }));

    router.get('/api/v1/members/:memberid/loans/:loanid/calculate', asyncHandler((req: Request, res: Response) => {
        return new LoanController().calculateInterest(req, res);
    }));

    router.post('/api/v1/members/:memberid/loans', asyncHandler((req: Request, res: Response) => {
        return new LoanController().addLoan(req, res);
    }));

    router.put('/api/v1/members/:memberid/loans/:loanid', asyncHandler((req: Request, res: Response) => {
        return new LoanController().updateLoan(req, res);
    }));

    router.delete('/api/v1/members/:memberid/loans/:loanid', asyncHandler((req: Request, res: Response) => {
        return new LoanController().deleteLoan(req, res);
    }));
    
    // loan transactions 

    router.post('/api/v1/loantransactions', asyncHandler((req: Request, res: Response) => {
        return new LoanTransactionController().addLoanTransaction(req, res);
    }));

    router.put('/api/v1/loantransactions/:loantransactionid', asyncHandler((req: Request, res: Response) => {
        return new LoanTransactionController().updateLoanTransaction(req, res);
    }));

    router.delete('/api/v1/loantransactions/:loantransactionid', asyncHandler((req: Request, res: Response) => {
        return new LoanTransactionController().deleteLoanTransaction(req, res);
    }));

}).catch(error => {
    console.log('Error while connecting to the vault');
    console.error(error)
})
