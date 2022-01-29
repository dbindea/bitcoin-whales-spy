import scrapeIt from 'scrape-it';
import config from '../../config';
import UtilsService from '../utils.service';

export default class BitcoinService {
  utilsService = new UtilsService();

  async scanBtcScrapIt() {
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
        this.utilsService.log({ summary: `push transactions for ${addresses[index]}`, message: `transactions count: ${array.data.page.length}` });
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

  async scanBtcPuppetter(browser) {
    const urlObj = this.utilsService.splitData(config.BTC_ADDRESSES).map((address) => ({ url: config.BTC_URL + address, address }));

    urlObj.forEach(async (object) => {
      await this.scanBtcUrl(browser, object.url, object.address);
    });
  }

  async scanBtcUrl(browser, url, address) {
    let newPage = await browser.newPage();
    await newPage.goto(url);
    await newPage.waitForSelector('table#table_maina');
    let transactions = await newPage.$$eval('tr.trb', (tds) => {
      tds.map((el) => {
        return {
          block: el.querySelector('a').text,
          time: el.querySelector('a'.text),
          amount: Number(el.querySelector('td:nth-child(3n) span').text.split('BTC')[0].trim().replace(',', '')),
          price: Number(el.querySelector('td:nth-child(5n)').text.split('@')[1].trim().slice(1).replace(',', '')),
          currency: 'USD',
        };
      });
      return tds;
    });
    transactions.map((transact) => (transact.address = address));
  }
}
