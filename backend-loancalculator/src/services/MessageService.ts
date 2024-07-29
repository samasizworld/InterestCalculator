import { QueryTypes, Sequelize } from "sequelize";
import { GeneralService } from "./GeneralService";
import { Status } from "../utils/enums";

export class MessageService extends GeneralService<any> {
    messageContext: Sequelize
    constructor(dbContext: Sequelize) {
        super(dbContext);
        this.messageContext = dbContext;
    }

    async getReadyMessages() {
        const messages = await this.messageContext.query(`
            SELECT m.* 
            FROM messages m 
            WHERE m.datedeleted IS NULL AND m.notificationstatus='ready' ORDER BY m.datecreated ASC LIMIT 1;`, { type: QueryTypes.SELECT });
        return messages;
    }

    async updateMessage(id: string, messagestatus: Status) {
        await this.messageContext.query(`
            UPDATE messages
            SET notificationstatus =:messagestatus
            WHERE datedeleted IS NULL AND guid=:id`, { type: QueryTypes.UPDATE, replacements: { id, messagestatus } });

    }


    async addMessage(model: any) {
        await this.messageContext.query(`
            INSERT INTO messages(subject, body, recipientemailaddress, attachments)
            VALUES(:subject, :body, :recipientemailaddress, :attachments) RETURNING * `, { type: QueryTypes.INSERT, replacements: { body: model.body, subject: model.subject, recipientemailaddress: model.recipientemailaddress, attachments: JSON.stringify(model.attachments) } });
    }
}