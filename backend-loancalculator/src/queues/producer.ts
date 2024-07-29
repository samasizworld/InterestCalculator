import { Queue } from "bullmq";
import { createDbContext } from "../connection/DBConnection";
import { MessageService } from "../services/MessageService";


export const init = async () => {
    const emailQueue = new Queue('email-queue-pgrp', { connection: { host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT) } });
    const dbContext = createDbContext();
    const messageService = new MessageService(dbContext);
    let messages: any[] = await messageService.getReadyMessages();
    for (const message of messages) {
        const res = await emailQueue.add(`message-${message.recipientemailaddress}`, message);
        console.log(`Job ${res.id} is added to queue.`);
    }
}