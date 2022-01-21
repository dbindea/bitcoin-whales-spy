export default class UtilsService {
  splitData(string) {
    return string
      .split(',')
      .filter((el) => el != null && el.toString().trim())
      .map((el) => el.trim());
  }
}
