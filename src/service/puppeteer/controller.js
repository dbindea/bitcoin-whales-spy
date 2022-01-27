const page = require('./page');
async function scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        await page.scraper(browser, 'http://books.toscrape.com');
        // await browser.close();
    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)