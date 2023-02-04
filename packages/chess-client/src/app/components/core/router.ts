import type PageController from '../../interfaces/page';

export interface RouteNames {
  name: string;
  controller: PageController;
}

const INDEX_OF_SECOND_ITEM_IN_ITERABLE = 1;

export default class Router {
  private readonly routes: RouteNames[];

  private readonly onHashChange: (routeName: PageController) => void;

  constructor(routes: RouteNames[], onHashChange: (page: PageController) => void) {
    this.onHashChange = onHashChange;
    this.routes = routes;
    window.onhashchange = this.hashChanged;
  }

  hashChanged = (): void => {
    const route =
      window.location.hash.length > 0
        ? window.location.hash.substr(INDEX_OF_SECOND_ITEM_IN_ITERABLE)
        : 'default';
    const actualRoute = this.routes.find((routeName) => routeName.name === route);
    if (actualRoute) {
      this.onHashChange(actualRoute.controller);
    }
  };
}
