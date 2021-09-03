export default abstract class State<T> {
  protected context: T;

  public setContext(context: T): void {
    this.context = context;
  }

  clickHandler: () => void;

  public abstract createButton(
    onFirstButtonClick?: () => void,
    onSecondButtonClick?: () => void,
    avatar?: string,
  ): void;
}
