import type PageController from '../../interfaces/page';

export interface RouteNames {
  name: string;
  controller: PageController;
}

const INDEX_OF_SECOND_ITEM_IN_ITERABLE = 1;

export default class Router {
  private readonly routes: RouteNames[];

  onHashChange: (routeName: PageController) => void;

  constructor(routes: RouteNames[], onHashChange: (page: PageController) => void) {
    this.onHashChange = onHashChange;
    this.routes = routes;
    window.onhashchange = this.hashChanged;
    this.hashChanged();
  }

  hashChanged = (): void => {
    const route =
      window.location.hash.length > 0
        ? window.location.hash.substr(INDEX_OF_SECOND_ITEM_IN_ITERABLE)
        : 'default';
    if (this.onHashChange) {
      this.onHashChange(this.routes.find((routeName) => routeName.name === route).controller);
    }
  };
}
