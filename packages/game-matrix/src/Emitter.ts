export class Emitter {
  public static events: any[] = [];
  public static on(event: string, cb: Function) {
    this.events.push({ event, cb });
  }

  public static emit(event: string, data: any, data1?: any) {
    this.events.forEach((v) => v.event === event && v.cb(data, data1));
  }
}
