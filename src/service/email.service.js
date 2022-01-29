import * as AWS from 'aws-sdk';
import { AWS_ACCESS, AWS_SECRET, BTC_URL, EMAIL_FROM, MAX_ALERTS_ADDR_TRANSACT } from '../config';
import EmailRequest from '../model/email.model';
import MongoService from './mongo.service';
import UtilsService from './utils.service';

export default class EmailService {
  mongoService = new MongoService();
  utilsService = new UtilsService();

  async notifyEmailSubscribers(emailArray, unnotifiedTransactions) {
    let count = 0;
    unnotifiedTransactions.forEach((transact) => {
      if (!transact.is_checked) {
        let text = '';
        let subject = '';

        if (transact.amount > 0) {
          subject = `🐳 Buys ${transact.amount} ${transact.asset}`;
          text = `${transact.amount} ${transact.asset} was purchased at ${transact.price} ${
            transact.currency
          } at ${transact.time.getHours()}:${transact.time.getMinutes()} at the address: <a href="${BTC_URL}${transact.address}" >${transact.address}</a>`;
        } else {
          subject = `🐳 Sells ${transact.amount} ${transact.asset}`;
          text = `${transact.amount} ${transact.asset} were sold at ${transact.price} ${
            transact.currency
          } at ${transact.time.getHours()}:${transact.time.getMinutes()} at the address: <a href="${BTC_URL}${transact.address}" >${transact.address}</a>`;
        }
        if (count++ < MAX_ALERTS_ADDR_TRANSACT) {
          this.sendEmail(emailArray, subject, text);
        }
        transact.is_checked = true;
        this.mongoService.markAsChecked(transact);
      }
    });
  }

  sendEmail(emailArray, subject, text) {
    // Build email object
    let email = new EmailRequest({
      from: EMAIL_FROM,
      toAddresses: emailArray,
      subject: subject,
      lang: undefined,
      text: text,
      html: text,
      bccAddresses: undefined,
      replyToAddresses: undefined,
    });

    // AWS Config
    let SESConfig = {
      apiVersion: '2010-12-01',
      accessKeyId: AWS_ACCESS,
      secretAccessKey: AWS_SECRET,
      region: 'eu-central-1',
    };

    // Build AWS email
    let awsEmail = {
      Source: email.from,
      Destination: {
        ToAddresses: [email.from],
        CcAddresses: email.ccAddresses,
        BccAddresses: email.toAddresses,
      },
      ReplyToAddresses: email.replyToAddresses,
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: email.html,
          },
          Text: {
            Charset: 'UTF-8',
            Data: email.text,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: email.subject,
        },
      },
    };

    // Send email
    new AWS.SES(SESConfig).sendEmail(awsEmail, function (err, data) {
      const utilsService = new UtilsService();
      if (err) utilsService.log({ summary: 'email send error', level: 'error', message: { error: err, stack: err.stack } });
      else utilsService.log({ summary: 'email sent', message: data.MessageId });
    });
  }
}
