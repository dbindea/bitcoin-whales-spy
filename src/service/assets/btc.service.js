import config from '../../config';
import UtilsService from '../utils.service';

export default class BitcoinService {
  utilsService = new UtilsService();
  transact = [];

  async scanBtc(browser) {
    const urlObj = this.utilsService.splitData(config.BTC_ADDRESSES).map((address) => ({url: config.BTC_URL + address, address}));

    urlObj.forEach(async (object) => {
      // console.log(object);
      await this.scanBtcUrl(browser, object.url, object.address);

      // console.log('pagina guardada');
    });
  }

  async scanBtcUrl(browser, url, address) {
    // console.log(address);
    let newPage = await browser.newPage();
    await newPage.goto(url);
    await newPage.waitForSelector('table#table_maina');

    let transactions = await newPage.$$eval('tr.trb', (tds) => {
      
      tds.forEach((el) => {

        console.log('el', el);

        /* return {
          block: el.querySelector('a').text,
          time: el.querySelector('a'.text),
          // amount: Number(el.querySelector('td:nth-child(3n) span').text.split('BTC')[0].trim().replace(',', '')),
          // price: Number(el.querySelector('td:nth-child(5n)').text.split('@')[1].trim().slice(1).replace(',', '')),
          currency: 'USD',
        }; */
      });
      return tds;
    });

    transactions.map((transact) => (transact.address = address));

    console.log(transactions);
  }

/*   getValue(el, selector) {
    return el.querySelector(selector).text;
  } */

  /* 

  data: {
    block: 'a',
    time: {
      selector: 'td span.muted.utc.hidden-desktop',
      convert: (date) => new Date(date),
    },
    amount: {
      selector: 'td:nth-child(3n) span',
      convert: (x) => Number(x.split('BTC')[0].trim().replace(',', '')),
    },
    price: {
      selector: 'td:nth-child(5n)',
      convert: (x) => Number(x.split('@')[1].trim().slice(1).replace(',', '')),
    },
  },


 */

  _scanBtcUrl(browser, url) {
    return new Promise(async (resolve, reject) => {
      let dataObj = {};
      let newPage = await browser.newPage();
      await newPage.goto(url);

      await newPage.waitForSelector('table');

      dataObj['td'] = await newPage.$$eval('tr.trb', (text) => {
        console.log(text);
        return text;
      });

      /*       const transact = await page.$$eval('tr.trb', (td) => {
        // return td;
        console.log(td);
      }); */

      // console.log(transact);

      /*         dataObj['bookTitle'] = await newPage.$eval('.product_main > h1', (text) => text.textContent);
        dataObj['bookPrice'] = await newPage.$eval('.price_color', (text) => text.textContent);
        dataObj['noAvailable'] = await newPage.$eval('.instock.availability', (text) => {
          // Strip new line and tab spaces
          text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, '');
          // Get the number of stock available
          let regexp = /^.*\((.*)\).*$/i;
          let stockAvailable = regexp.exec(text)[1].split(' ')[0];
          return stockAvailable;
        });
        dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', (img) => img.src);
        // dataObj['bookDescription'] = await newPage.$eval('#product_description', (div) => div.nextSibling.nextSibling.textContent);
        dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', (table) => table.textContent);
        await newPage.close(); */

      resolve(dataObj);
    });
  }

  async x_scanUrl(browser, url) {
    let page = await browser.newPage();
    await page.goto(url);

    const transactionsResult = [];
    await page.waitForSelector('table#table_maina');

    // Get the link to all the required books
    let tdTransact = await page.$$eval('tr.trb', (td) => {
      /*       // Make sure the book to be scraped is in stock
      td = td.filter((elem) => elem.querySelector('.instock.availability > i').textContent !== 'In stock');
      // Extract the links from the data
      td = td.map((el) => el.querySelector('h3 > a').href); */
      return td;
    });

    // Loop through each of those links, open a new page instance and get the relevant data from them
    let pagePromise = (td) =>
      new Promise(async (resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();
        await newPage.goto(td);
        dataObj['bookTitle'] = await newPage.$eval('.product_main > h1', (text) => text.textContent);
        dataObj['bookPrice'] = await newPage.$eval('.price_color', (text) => text.textContent);
        dataObj['noAvailable'] = await newPage.$eval('.instock.availability', (text) => {
          // Strip new line and tab spaces
          text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, '');
          // Get the number of stock available
          let regexp = /^.*\((.*)\).*$/i;
          let stockAvailable = regexp.exec(text)[1].split(' ')[0];
          return stockAvailable;
        });
        dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', (img) => img.src);
        // dataObj['bookDescription'] = await newPage.$eval('#product_description', (div) => div.nextSibling.nextSibling.textContent);
        dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', (table) => table.textContent);
        resolve(dataObj);
        await newPage.close();
      });

    /* tdTransact.forEach(async (link) => {
        let transactions = await pagePromise(link);
        transactionsResult.push(transactions);

        console.log(transactions);
    }); */
  }

  async __scanBtc() {
    const promises = [];
    const result = [];

    const addresses = this.utilsService.splitData(config.BTC_ADDRESSES);
    const callback = {
      page: {
        listItem: 'div h1',
        data: {
          text: 'span',
        },
        /* listItem: 'table#table_maina tbody tr',
        data: {
          block: 'a',
          time: {
            selector: 'td span.muted.utc.hidden-desktop',
            convert: (date) => new Date(date),
          },
          amount: {
            selector: 'td:nth-child(3n) span',
            convert: (x) => Number(x.split('BTC')[0].trim().replace(',', '')),
          },
          price: {
            selector: 'td:nth-child(5n)',
            convert: (x) => Number(x.split('@')[1].trim().slice(1).replace(',', '')),
          },
        }, */
      },
    };

    addresses.forEach((address) => {
      scrapeIt('https://bitinfocharts.com/bitcoin/address/1P5ZEDWTKTFGxQjZphgWPQUpe554WKDfHQ', callback).then(({ data, response }) => {
        console.log(data.page);
        console.log('STATUS CODE ' + response.statusCode, response.statusMessage);
      });
      // promises.push(scrapeIt(config.BTC_URL + address, callback));
    });

    /* const promisesResponse = await Promise.all(promises);

    promisesResponse.forEach((array, index) => {
      if (array && array.data && array.data.page) {
        result.push({
          asset: 'BTC',
          address: addresses[index],
          transactions: array.data.page,
          currency: 'USD',
        });
      }
    });

    return await Promise.resolve(result); */
  }

  async _scanBtc() {
    const promises = [];
    const result = [];

    const addresses = this.utilsService.splitData(config.BTC_ADDRESSES);
    const callback = {
      page: {
        listItem: 'tr.trb',
        data: {
          block: 'a',
          time: {
            selector: 'td span.muted.utc.hidden-desktop',
            convert: (date) => new Date(date),
          },
          amount: {
            selector: 'td:nth-child(3n) span',
            convert: (x) => Number(x.split('BTC')[0].trim().replace(',', '')),
          },
          price: {
            selector: 'td:nth-child(5n)',
            convert: (x) => Number(x.split('@')[1].trim().slice(1).replace(',', '')),
          },
        },
      },
    };

    addresses.forEach((address) => {
      promises.push(scrapeIt(config.BTC_URL + address, callback));
    });

    const promisesResponse = await Promise.all(promises);

    promisesResponse.forEach((array, index) => {
      if (array && array.data && array.data.page) {
        result.push({
          asset: 'BTC',
          address: addresses[index],
          transactions: array.data.page,
          currency: 'USD',
        });
      }
    });

    return await Promise.resolve(result);
  }
}
