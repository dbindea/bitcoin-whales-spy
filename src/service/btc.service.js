import config from '../config';
import UtilsService from './utils.service';

const scrapeIt = require('scrape-it');

export default class BitcoinService {
  utilsService = new UtilsService();

  async scanBtc() {
    const promises = [];
    const result = [];

    const addresses = this.utilsService.splitData(config.BTC_ADDRESSES);
    const callback = {
      page: {
        listItem: 'td.coin',
        data: {
          block: 'span'
        },
      },
    };

    addresses.forEach((address) => {
      scrapeIt('https://bitinfocharts.com/', callback).then(({ data, response }) => {
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
