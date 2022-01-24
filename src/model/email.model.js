export default class EmailRequest {
  constructor(object) {
    (this.from = object.from),
      (this.toAddresses = object.toAddresses),
      (this.subject = object.subject),
      (this.lang = object.lang),
      (this.text = object.text),
      (this.html = object.html),
      (this.ccAddresses = object.ccAddresses),
      (this.bccAddresses = object.bccAddresses),
      (this.replyToAddresses = object.replyToAddresses);
  }
}
