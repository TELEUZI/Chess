import PageController from '../../../interfaces/page';

import AboutPageView from './about-page-view';

export default class AboutPage implements PageController {
  private root: HTMLElement;

  private view: AboutPageView;

  constructor(root: HTMLElement) {
    this.root = root;
    this.view = new AboutPageView();
  }

  createPage(): void {
    this.root.appendChild(this.view.getNode());
  }
}
