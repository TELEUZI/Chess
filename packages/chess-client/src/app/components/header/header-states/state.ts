export default abstract class State<T> {
  protected context: T | undefined;

  public setContext(context: T): void {
    this.context = context;
  }

  public abstract createButton(config: {
    onFirstButtonClick?: () => void;
    onSecondButtonClick?: () => void;
    avatar?: ArrayBuffer | string;
  }): void;
}
