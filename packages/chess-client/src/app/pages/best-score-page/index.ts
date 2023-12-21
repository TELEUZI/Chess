import type { GameResult, PageController } from '@chess/game-common';
import { AppRoutes, FigureColor, GameMode } from '@chess/game-common';
import { storeService } from '@chess/game-engine';
import BaseComponent from '../../components/base-component';
import ReplayDaoService from '../../services/replay-dao-service';
import Card from '../../components/card/card';

export type Winner = 'Black' | 'No one' | 'White';

const getWinner = (result: GameResult | null): Winner => {
  switch (result) {
    case FigureColor.WHITE:
      return 'White';
    case FigureColor.BLACK:
      return 'Black';
    default:
      return 'No one';
  }
};
export default class BestScorePage implements PageController {
  private readonly replayModel: ReplayDaoService;

  constructor(private readonly root: HTMLElement) {
    this.root = root;
    this.replayModel = ReplayDaoService.getInstance();
  }

  public async createPage(): Promise<void> {
    const cards = await this.replayModel.getAll();
    const cardContainer = new BaseComponent({ tag: 'div', className: 'card-container' });
    cards.forEach((card) => {
      const gameResult = getWinner(card.result);
      const cardView = new Card(
        card.players[0].name,
        card.players[1].name,
        card.date,
        card.moves,
        gameResult,
        () => {
          storeService.setGameMode(GameMode.REPLAY);
          storeService.setReplayStateDate(card.date);
          window.location.hash = AppRoutes.WATCH;
        },
      );
      cardContainer.append(cardView);
    });
    this.root.append(cardContainer.getNode());
  }
}
