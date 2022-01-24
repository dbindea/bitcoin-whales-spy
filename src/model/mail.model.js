
export class EmailRequest {
  @ApiProperty()
  from?: string

  @ApiProperty()
  toAddresses: string[]

  @ApiProperty()
  subject: string

  @ApiProperty()
  lang: string

  @ApiProperty()
  text?: string

  @ApiProperty()
  html?: string

  @ApiProperty()
  ccAddresses?: string[]

  @ApiProperty()
  bccAddresses?: string[]

  @ApiProperty()
  replyToAddresses?: string[]

  constructor(object: any) {
    this.toAddresses = object.toAddresses
    this.subject = object.subject
    this.lang = object.lang
    this.text = object.text
    this.html = object.html
    this.ccAddresses = object.ccAddresses
    this.bccAddresses = object.bccAddresses
    this.replyToAddresses = object.replyToAddresses
  }
}