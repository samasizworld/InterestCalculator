"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWorker = void 0;
const DBConnection_1 = require("../connection/DBConnection");
const MessageService_1 = require("../services/MessageService");
const enums_1 = require("../utils/enums");
const logger_1 = require("../utils/logger");
const mailSender_1 = require("../utils/mailSender");
const bullmq_1 = require("bullmq");
const startWorker = () => {
    const dbContext = (0, DBConnection_1.createDbContext)();
    const messageService = new MessageService_1.MessageService(dbContext);
    const logger = new logger_1.Logger();
    const emailWorker = new bullmq_1.Worker('email-queue-pgrp', (job) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(`recieved a message with job ${job.id}`);
            yield (0, mailSender_1.sendMailTo)(job.data.recipientemailaddress, job.data.body, job.data.subject, job.data.attachments);
        }
        catch (error) {
            logger.errorLog(error, 'startWorker');
            yield messageService.updateMessage(job.data.guid, enums_1.Status.error);
            // should throw error otherwise it hits completed event
            throw error;
        }
    }), { connection: { host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT) } });
    emailWorker.on('completed', (job) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Job ${job.id} has completed`);
        yield messageService.updateMessage(job.data.guid, enums_1.Status.sent);
    }));
};
exports.startWorker = startWorker;
//# sourceMappingURL=worker.js.map