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
exports.pdfGenerateByHtml = void 0;
const puppeteer_1 = require("puppeteer");
const pdfGenerateByHtml = (content) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield (0, puppeteer_1.launch)({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ], timeout: 60000
    });
    const page = yield browser.newPage();
    yield page.setContent(content);
    yield page.emulateMediaType('screen');
    const pdf = yield page.pdf({
        format: 'a4',
        printBackground: true,
    });
    yield browser.close();
    return pdf;
});
exports.pdfGenerateByHtml = pdfGenerateByHtml;
//# sourceMappingURL=pdfGenerator.js.map