import Bitcoin from './btc.service';

export default class LaunchPlatform {
  btc = new Bitcoin();

  async launch() {
    const btcTransactions = await this.btc.scanBtc();

    console.log(btcTransactions);
  }
}
