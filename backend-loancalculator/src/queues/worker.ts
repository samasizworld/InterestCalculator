import { createDbContext } from "../connection/DBConnection";
import { MessageService } from "../services/MessageService";
import { Status } from "../utils/enums";
import { Logger } from "../utils/logger";
import { sendMailTo } from "../utils/mailSender";
import { Worker } from "bullmq";

export const startWorker = () => {
    const dbContext = createDbContext();
    const messageService = new MessageService(dbContext);
    const logger = new Logger();
    const emailWorker = new Worker('email-queue-pgrp', async (job) => {
        try {
            console.log(`recieved a message with job ${job.id}`);
            await sendMailTo(job.data.recipientemailaddress, job.data.body, job.data.subject, job.data.attachments);
        } catch (error) {
            logger.errorLog(error, 'startWorker');
            await messageService.updateMessage(job.data.guid, Status.error);
            // should throw error otherwise it hits completed event
            throw error;
        }

    }, { connection: { host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT) } });

    emailWorker.on('completed', async (job: any) => {
        console.log(`Job ${job.id} has completed`);
        await messageService.updateMessage(job.data.guid, Status.sent);
    });
};