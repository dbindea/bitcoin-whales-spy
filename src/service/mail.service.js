import MongoService from './mongo.service';

export default class MailService {
  mongo = new MongoService();
  async notifyMailSubscribers(mailArray, unnotifiedTransactions) {
    unnotifiedTransactions.forEach((transact) => {
      if (!transact.is_checked) {
        if (transact.amount > 0) {
          console.info(
            `[...${transact.address.substr(transact.address.length - 5)}] Compra ${transact.amount} ${transact.asset} a ${transact.price} ${
              transact.currency
            } a las ${transact.time.getHours()}:${transact.time.getMinutes()}`,
          );
        } else {
          console.info(
            `[...${transact.address.substr(transact.address.length - 5)}] Venta ${transact.amount} ${transact.asset} a ${transact.price} ${
              transact.currency
            } a las ${transact.time.getHours()}:${transact.time.getMinutes()}`,
          );
        }
        transact.is_checked = true;
        this.mongo.markAsChecked(transact);
      }
    });
  }

  async sendMail(mail, subject, text) {
    let status = false;


    let emailRequestTemplate: EmailRequest = new EmailRequest({
      toAddresses: [user.email],
      subject: subject,
      lang: user.lang,
      text: text,
      html: html,
      bccAddresses: appConfig().comunications.email.callback,
    })
    let result = this.awsEmailService.sendSimpleEmail(emailRequestTemplate)


    return status;
  }

  send() {
    let SESConfig = this.getSESConfig()
    let email = this.buildEmail(request)
    return new AWS.SES(SESConfig).sendEmail(email).promise()
  }

  private getSESConfig() {
    return { ...appConfig().comunications.email.aws }
  }

  private buildEmail(request: EmailRequest): any {
    request.from = appConfig().comunications.email.from

    return {
      Source: request.from,
      Destination: {
        ToAddresses: this.validateAddress(request.toAddresses),
        CcAddresses: this.validateAddress(request.ccAddresses),
        BccAddresses: this.validateAddress(request.bccAddresses),
      },
      ReplyToAddresses: this.validateAddress(request.replyToAddresses),
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: request.html,
          },
          Text: {
            Charset: 'UTF-8',
            Data: request.text,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: request.subject,
        },
      },
    }
  }
}
