import PageController from '../../../interfaces/page';
import StartPageView from './start-page-view';

export default class StartPage implements PageController {
  private root: HTMLElement;

  private view: StartPageView;

  constructor(root: HTMLElement) {
    this.root = root;
    this.view = new StartPageView();
  }

  createPage(): void {
    this.root.appendChild(this.view.getNode());
  }
}
