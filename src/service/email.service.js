import * as AWS from 'aws-sdk';
import { AWS_ACCESS, AWS_SECRET, EMAIL_FROM } from '../config';
import EmailRequest from '../model/email.model';
import MongoService from './mongo.service';

const MAX_ALERTS_ADDR_TRANSACT = 5;

export default class EmailService {
  mongo = new MongoService();
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
          } at ${transact.time.getHours()}:${transact.time.getMinutes()} at the address: ${transact.address}`;
        } else {
          subject = `🐳 Sells ${transact.amount} ${transact.asset}`;
          text = `${transact.amount} ${transact.asset} were sold at ${transact.price} ${
            transact.currency
          } at ${transact.time.getHours()}:${transact.time.getMinutes()} at the address: ${transact.address}`;
        }
        if (count++ < MAX_ALERTS_ADDR_TRANSACT) {
          this.sendEmail(emailArray, subject, text);
        }
        transact.is_checked = true;
        this.mongo.markAsChecked(transact);
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
    return new AWS.SES(SESConfig).sendEmail(awsEmail).promise();
  }
}
