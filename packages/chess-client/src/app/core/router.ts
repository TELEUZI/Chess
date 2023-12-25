import { AppRoutes } from '@chess/game-common';
import type { PageController } from '@chess/game-common';
import type GamePage from '../pages/game-page';

export interface RouteNames {
  name: string;
  controller: Promise<PageController>;
}

const INDEX_OF_SECOND_ITEM_IN_ITERABLE = 1;

export class Router {
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

export function createAppRoutes(
  root: HTMLElement,
  gamePage: Promise<GamePage>,
): { name: AppRoutes; controller: Promise<PageController> }[] {
  return [
    {
      name: AppRoutes.DEFAULT,
      controller: import('../pages/reg-page').then(({ default: AboutPage }) => new AboutPage(root)),
    },
    {
      name: AppRoutes.SETTINGS,
      controller: import('../pages/settings-page').then(
        ({ default: SettingsPage }) => new SettingsPage(root),
      ),
    },
    {
      name: AppRoutes.REPLAY,
      controller: import('../pages/best-score-page').then(
        ({ default: BestScorePage }) => new BestScorePage(root),
      ),
    },
    {
      name: AppRoutes.GAME,
      controller: gamePage,
    },
    {
      name: AppRoutes.WATCH,
      controller: import('../pages/replay-page').then(
        ({ default: ReplayPage }) => new ReplayPage(root),
      ),
    },
  ];
}
