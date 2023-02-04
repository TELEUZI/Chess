class Observable<ListenerType> {
  private listeners: ((params: ListenerType) => void)[];

  constructor() {
    this.listeners = [];
  }

  subscribe(listener: (params: ListenerType) => void): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: (params: ListenerType) => void): void {
    this.listeners = this.listeners.filter((elem) => elem !== listener);
  }

  notify(params: ListenerType): void {
    this.listeners.forEach((listener) => {
      listener(params);
    });
  }
}
export default Observable;
