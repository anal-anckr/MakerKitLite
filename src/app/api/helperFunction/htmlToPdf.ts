const fs = require('fs');
const util = require('util');
import Chromium from '@sparticuz/chromium';
import getLogger from '~/core/logger';

/**
 * Converts HTML content to a PDF buffer.
 * @param {string} htmlContent The HTML content to render as a PDF.
 * @param {object} [options={}] Additional options for PDF rendering.
 * @returns {Promise<Buffer>} A promise that resolves with the PDF data as a Buffer.
 */

const logger = getLogger();



// Browser setup
async function setupBrowser() {
  const puppeteer = await import(process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? 'puppeteer-core' : 'puppeteer');
  const options = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? {
    args: Chromium.args,
    defaultViewport: Chromium.defaultViewport,
    executablePath: await Chromium.executablePath(),
    headless: true,
    ignoreHTTPSErrors: true,
  } : {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=egl'],
    ignoreHTTPSErrors: true,
  };
  const browser = await puppeteer.launch(options)
  return browser;
}

// PDF generation
async function generatePdf(page: any, htmlContent: string, bufferOptions: {}) {
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfData = page.pdf({ format: 'A4', printBackground: true, ...bufferOptions });
  return pdfData;
}


// Main function
async function htmlToPdf(htmlContent: string, bufferOptions = {}) {
  let browser = null;
  try {
    browser = await setupBrowser();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36');
    const pdfBuffer = await generatePdf(page, htmlContent, bufferOptions);
    return pdfBuffer;
  } catch (error) {
    logger.error('Failed to generate PDF:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}



//usage
// const pdfBuffer = await htmlToPdf(htmlContent, {
//   displayHeaderFooter: true,
//   headerTemplate: `
//     <div style="...">
//       <img src="${rmrLogo}" alt="rmr logo" style="...">
//       ...
//     </div>`,
//   footerTemplate: `
//     <div style="...">
//       <span>© 2021 ReadMyRhythm.</span>
//       <img src="${appStoreImage}" alt="Read My Rhythm on App Store" style="...">
//       ...
//     </div>`,
//   margin: {
//     top: '100px',
//     bottom: '60px',
//     left: '40px',
//     right: '40px',
//   }
// });
