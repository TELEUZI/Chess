import type { PageController } from '@chess/game-common';

export interface RouteNames {
  name: string;
  controller: Promise<PageController>;
}

const INDEX_OF_SECOND_ITEM_IN_ITERABLE = 1;

export default class Router {
  private readonly routes: RouteNames[];

  private readonly onHashChange: (routeName: PageController) => void;

  private currentPage: PageController | null = null;

  constructor(routes: RouteNames[], onHashChange: (page: PageController) => void) {
    this.onHashChange = onHashChange;
    this.routes = routes;
    window.onhashchange = this.hashChanged;
  }

  public hashChanged = (): void => {
    const route =
      window.location.hash.length > 0
        ? window.location.hash.substring(INDEX_OF_SECOND_ITEM_IN_ITERABLE)
        : 'default';
    const actualRoute = this.routes.find((routeName) => routeName.name === route);
    if (actualRoute) {
      void actualRoute.controller.then((page) => {
        if (this.currentPage) {
          this.currentPage.destroyPage?.();
        }
        this.currentPage = page;

        this.onHashChange(page);
      });
    }
  };
}
