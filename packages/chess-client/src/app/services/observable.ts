class Observable<ListenerType> {
  private listeners: ((params: ListenerType) => void)[];

  constructor() {
    this.listeners = [];
  }

  public subscribe(listener: (params: ListenerType) => void): void {
    this.listeners.push(listener);
  }

  public unsubscribe(listener: (params: ListenerType) => void): void {
    this.listeners = this.listeners.filter((elem) => elem !== listener);
  }

  public notify(params: ListenerType): void {
    this.listeners.forEach((listener) => {
      listener(params);
    });
  }
}
export default Observable;
