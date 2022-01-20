import config from '../config';

const scrapeIt = require('scrape-it');

export default class Bitcoin {
  async scanBtc() {
    const promises = [];
    const result = [];

    const addresses = config.BTC_ADDRESSES.split(',')
      .filter((el) => el != null && el.toString().trim())
      .map((el) => el.trim());

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
        });
      }
    });

    return await Promise.resolve(result);
  }
}
