import { launch } from 'puppeteer';

export const pdfGenerateByHtml = async (content: string) => {
    const browser = await launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ], timeout: 60000
    });
    const page = await browser.newPage();
    await page.setContent(content);
    await page.emulateMediaType('screen');
    const pdf = await page.pdf({
        format: 'a4',
        printBackground: true,
    });
    await browser.close();
    return pdf;

}
