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
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const producer_1 = require("./src/queues/producer");
const worker_1 = require("./src/queues/worker");
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
    app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
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
    router.patch('/api/v1/members/:memberid/loans/:loanid/sendmail', (0, errorMiddleware_1.asyncHandler)((req, res) => {
        return new LoanController_1.LoanController().sendMemberAEmailWithLoanInterestPaymentDetail(req, res);
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
    // in future, it will be added on child_process/ worker process
    // 0 7 * * 0 weekly at 7 in saturday. 
    // 0 7 * * 6
    node_cron_1.default.schedule(process.env.EMAIL_SCHEDULE, () => {
        console.log(`Cron job schedule ${process.env.EMAIL_SCHEDULE} started.`);
        new LoanController_1.LoanController().checkAndSendMailToThoseWhoHaventPaidMoreThan90days();
    });
    node_cron_1.default.schedule(process.env.REDIS_PRODUCER_SCHEDULE, () => {
        console.log(`Pushing into Redis MQ in schedule of ${process.env.REDIS_PRODUCER_SCHEDULE}`);
        (0, producer_1.init)();
    });
    (0, worker_1.startWorker)();
}).catch(error => {
    console.log('Error while connecting to the vault');
    console.error(error);
});
//# sourceMappingURL=index.js.map