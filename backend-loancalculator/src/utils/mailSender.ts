import nodemailer from 'nodemailer';
import { google } from 'googleapis';
export const sendMailTo = async (recieverEmailAddress: string, body: string = 'This is only test mail', subject: string = 'Test Mail', attachments: any[] = []) => {

    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
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

    await transport.sendMail(mailOptions);
    console.log(`Email sent successfully to ${recieverEmailAddress}`);

}