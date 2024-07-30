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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailTo = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const sendMailTo = (recieverEmailAddress_1, ...args_1) => __awaiter(void 0, [recieverEmailAddress_1, ...args_1], void 0, function* (recieverEmailAddress, body = 'This is only test mail', subject = 'Test Mail', attachments = []) {
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const accessToken = yield oAuth2Client.getAccessToken();
    const transport = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'testelkiwi@gmail.com',
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: accessToken.token,
        },
    });
    const mailOptions = {
        from: 'P GROUP',
        to: recieverEmailAddress,
        subject,
        html: body,
        attachments
    };
    yield transport.sendMail(mailOptions);
    console.log(`Email sent successfully to ${recieverEmailAddress}`);
});
exports.sendMailTo = sendMailTo;
//# sourceMappingURL=mailSender.js.map