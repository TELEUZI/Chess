import BaseComponent from '../../components/base-component';
import type PageController from '../../interfaces/page';
import store from '../game-page/chess-game/state/redux/store';
import GameMode from '../../enums/game-mode';
import { setGameMode, setReplayState } from '../game-page/chess-game/state/redux/action-creators';
import ReplayDaoService from '../../services/replay-dao-service';
import Card from '../../components/card/card';
import FigureColor from '../../enums/figure-colors';
import type { Winner } from '../../interfaces/winner';
import AppRoutes from '../../enums/app-routes';
import type { GameResult } from '../../interfaces/replay';

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

  async createPage(): Promise<void> {
    const cards = await this.replayModel.getAll();
    const cardContainer = new BaseComponent('div', ['card-container']);
    cards.forEach((card) => {
      const gameResult = getWinner(card.result);
      const cardView = new Card(
        card.players[0].name,
        card.players[1].name,
        card.date,
        card.moves,
        gameResult,
        () => {
          store.dispatch(setGameMode(GameMode.REPLAY));
          store.dispatch(setReplayState(card.date));
          window.location.hash = AppRoutes.WATCH;
        },
      );
      cardContainer.insertChild(cardView);
    });
    this.root.append(cardContainer.getNode());
  }
}