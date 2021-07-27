import Controller from './components/core/controller';

class App {
  private controller: Controller;

  private root: HTMLElement;

  constructor(controller: Controller, root: HTMLElement) {
    this.controller = controller;
    this.root = root;
  }

  start(): void {
    this.root.append(this.controller.getNode());
  }
}
const app: App = new App(new Controller(), document.body);
app.start();
