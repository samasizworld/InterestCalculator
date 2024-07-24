import moment from 'moment';
import fs, { createWriteStream } from 'fs';
export class Logger {
    async errorLog(error: Error, functionName: string) {
        let dirPath = '/logger/loanapilogs/errorlogs/';
        let filePath = dirPath + 'loanapi-logger-' + moment().format('YYYY-MM-DD') + '_logs.log';
        let content = '..................ErrorLogger.............................' + '\n'
            + `Date:${moment().format('YYYY-MM-DD HH:mm:ss')} => Error at ${functionName} =>>>>> Message: ${error.message}` + '\n' + `ErrorStack: ${error.stack}` + '\n\n';

        console.log(content);
        // Check if the directory exists, if not, create it
        await fs.promises.mkdir(dirPath, { recursive: true });

        let logStream = await createWriteStream(filePath, { flags: 'a' });
        logStream.write(content);
        logStream.end();
    }

    async infoLog(message: string, functionName: string) {
        let dirPath = '/logger/loanapilogs/infologs';
        let filePath = dirPath + 'loanapi-logger-' + moment().format('YYYY-MM-DD') + '_logs.log';
        let content = '..................InfoLogger.............................' + '\n'
            + `Date:${moment().format('YYYY-MM-DD HH:mm:ss')} => ${functionName} =>>>>> Message: ${message}` + '\n\n\n';

        console.log(content);

        // Check if the directory exists, if not, create it
        await fs.promises.mkdir(dirPath, { recursive: true });

        let logStream = await createWriteStream(filePath, { flags: 'a' });
        logStream.write(content);
        logStream.end();
    }
}