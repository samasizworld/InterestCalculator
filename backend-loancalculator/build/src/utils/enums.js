"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageTemplates = exports.Status = void 0;
var Status;
(function (Status) {
    Status["ready"] = "ready";
    Status["error"] = "error";
    Status["sent"] = "sent";
})(Status || (exports.Status = Status = {}));
exports.messageTemplates = {
    "loanpaymentreminder": {
        body: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Reminder</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        background-color: #f8f8f8;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .content {
                        font-size: 16px;
                        color: #555;
                    }
                    .footer {
                        margin-top: 30px;
                        font-size: 14px;
                        color: #777;
                        text-align: center; /* Center-align the content */
                    }
                    .logo {
                        display: block;
                        margin: 0 auto 10px; /* Center the logo and add space below it */
                        width: 80px; /* Set the desired width */
                        height: auto; /* Maintain aspect ratio */
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Payment Reminder</div>
                    <div class="content">
                        <p>Hi <strong>{firstname}</strong>,</p>
                        <p>You haven't paid interest since 90 days. Please contact P Group loan committee member for more info.</p>
                        <p>Thank you.</p>
                    </div>
                    <div class="footer">
                        <img src="${process.env.API_URL}/logo.jpg" alt="Company Logo" class="logo">
                        <p>P Group Loan Committee</p>
                    </div>
                </div>
            </body>
            </html>`,
        subject: "Payment reminder"
    },
    "loanpaymentdetail": {
        body: `<p>Hi <strong>{firstname}</strong>,</p>
            <p>Please find attachments of your loan payment detail.</p>
            <p>Thank you.</p>`,
        subject: 'Loan payment details'
    }
};
//# sourceMappingURL=enums.js.map