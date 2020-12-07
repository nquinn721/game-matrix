export class Logger {
  public static logLevel = 1;

  public static log(...args: any[]) {
    if (this.logLevel > 0) console.log(...args);
  }
}
