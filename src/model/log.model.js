export default class Log {
  constructor(object) {
    (this.summary = object.summary), (this.level = object.level), (this.message = object.message), (this.timestamp = object.timestamp);
  }
}
