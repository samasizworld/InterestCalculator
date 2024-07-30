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
exports.MessageService = void 0;
const sequelize_1 = require("sequelize");
const GeneralService_1 = require("./GeneralService");
class MessageService extends GeneralService_1.GeneralService {
    constructor(dbContext) {
        super(dbContext);
        this.messageContext = dbContext;
    }
    getReadyMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield this.messageContext.query(`
            SELECT m.* 
            FROM messages m 
            WHERE m.datedeleted IS NULL AND m.notificationstatus='ready' ORDER BY m.datecreated ASC LIMIT 1;`, { type: sequelize_1.QueryTypes.SELECT });
            return messages;
        });
    }
    updateMessage(id, messagestatus) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.messageContext.query(`
            UPDATE messages
            SET notificationstatus =:messagestatus
            WHERE datedeleted IS NULL AND guid=:id`, { type: sequelize_1.QueryTypes.UPDATE, replacements: { id, messagestatus } });
        });
    }
    addMessage(model) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.messageContext.query(`
            INSERT INTO messages(subject, body, recipientemailaddress, attachments)
            VALUES(:subject, :body, :recipientemailaddress, :attachments) RETURNING * `, { type: sequelize_1.QueryTypes.INSERT, replacements: { body: model.body, subject: model.subject, recipientemailaddress: model.recipientemailaddress, attachments: JSON.stringify(model.attachments) } });
        });
    }
}
exports.MessageService = MessageService;
//# sourceMappingURL=MessageService.js.map