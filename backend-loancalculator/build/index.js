"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const errorMiddleware_1 = require("./src/middleware/errorMiddleware");
const PingController_1 = require("./src/controllers/PingController");
const VaultConnection_1 = require("./src/connection/VaultConnection");
const DBConnection_1 = require("./src/connection/DBConnection");
const MemberController_1 = require("./src/controllers/MemberController");
const logger_1 = require("./src/utils/logger");
const LoanController_1 = require("./src/controllers/LoanController");
const LoanTransactionController_1 = require("./src/controllers/LoanTransactionController");
(0, dotenv_1.config)({ path: "./.env" });
const router = express_1.default.Router();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// init vault
(0, VaultConnection_1.initVault)().then(() => {
    (0, DBConnection_1.sequelizeConnect)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)({
        "origin": "*",
        "allowedHeaders": "*",
        "exposedHeaders": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
    }));
    app.use('/', router);
    app.use((error, req, res, next) => {
        const logger = new logger_1.Logger();
        logger.errorLog(error, req.originalUrl);
        return res.status(500).send({ message: 'Something went wrong.' });
    });
    //  not found middleware
    app.use((req, res, next) => {
        return res.status(404).send({ message: `Page at ${req.originalUrl} is not found` });
    });
    // Just for ping
    router.get('/ping/:anything?', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new PingController_1.PingController().ping(req, res);
    }));
    // Members route
    router.get('/api/v1/members', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new MemberController_1.MemberController().getMembers(req, res);
    }));
    router.get('/api/v1/members/:memberid', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new MemberController_1.MemberController().getMember(req, res);
    }));
    router.post('/api/v1/members', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new MemberController_1.MemberController().addMember(req, res);
    }));
    router.put('/api/v1/members/:memberid', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new MemberController_1.MemberController().updateMember(req, res);
    }));
    router.delete('/api/v1/members/:memberid', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new MemberController_1.MemberController().deleteMember(req, res);
    }));
    // Loans route
    router.get('/api/v1/members/:memberid/loans', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new LoanController_1.LoanController().getLoans(req, res);
    }));
    router.get('/api/v1/members/:memberid/loans/:loanid', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new LoanController_1.LoanController().getLoan(req, res);
    }));
    router.get('/api/v1/members/:memberid/loans/:loanid/calculate', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new LoanController_1.LoanController().calculateInterest(req, res);
    }));
    router.patch('/api/v1/members/:memberid/loans/:loanid/download', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new LoanController_1.LoanController().downloadLoanPDF(req, res);
    }));
    router.post('/api/v1/members/:memberid/loans', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new LoanController_1.LoanController().addLoan(req, res);
    }));
    router.put('/api/v1/members/:memberid/loans/:loanid', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new LoanController_1.LoanController().updateLoan(req, res);
    }));
    router.delete('/api/v1/members/:memberid/loans/:loanid', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new LoanController_1.LoanController().deleteLoan(req, res);
    }));
    // loan transactions 
    router.post('/api/v1/loantransactions', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new LoanTransactionController_1.LoanTransactionController().addLoanTransaction(req, res);
    }));
    router.put('/api/v1/loantransactions/:loantransactionid', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new LoanTransactionController_1.LoanTransactionController().updateLoanTransaction(req, res);
    }));
    router.delete('/api/v1/loantransactions/:loantransactionid', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new LoanTransactionController_1.LoanTransactionController().deleteLoanTransaction(req, res);
    }));
    // port initialize
    server.listen(process.env.APP_PORT, () => { console.log(`Server listening in PORT ${process.env.APP_PORT}`); });
}).catch(error => {
    console.log('Error while connecting to the vault');
    console.error(error);
});
// in future, it will be added on child_process/ worker process
// cron.schedule('* * * * *', () => {
//     console.log('Schedule');
//     new LoanController().checkAndSendMailToThoseWhoHaventPaidMoreThan90days();
// });
//# sourceMappingURL=index.js.map