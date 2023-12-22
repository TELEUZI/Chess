import type { Unsubscribe } from 'redux';

export class Observable<ListenerType> {
  private listeners: ((params: ListenerType) => void)[];

  constructor() {
    this.listeners = [];
  }

  public subscribe(listener: (params: ListenerType) => void): Unsubscribe {
    this.listeners.push(listener);
    return () => {
      this.unsubscribe(listener);
      console.log('unsubscribe', this.listeners);
    };
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
