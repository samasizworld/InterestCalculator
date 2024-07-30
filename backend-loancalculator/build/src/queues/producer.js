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
exports.init = void 0;
const bullmq_1 = require("bullmq");
const DBConnection_1 = require("../connection/DBConnection");
const MessageService_1 = require("../services/MessageService");
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const emailQueue = new bullmq_1.Queue('email-queue-pgrp', { connection: { host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT) } });
    const dbContext = (0, DBConnection_1.createDbContext)();
    const messageService = new MessageService_1.MessageService(dbContext);
    let messages = yield messageService.getReadyMessages();
    for (const message of messages) {
        const res = yield emailQueue.add(`message-${message.recipientemailaddress}`, message);
        console.log(`Job ${res.id} is added to queue.`);
    }
});
exports.init = init;
//# sourceMappingURL=producer.js.map