import Coordinate from '../../../../models/coordinate';
import BaseComponent from '../../../base-component';
import Timer from '../../../timer/timer';
import ChessField from './field/field-controller';
import PlayerContainer from '../../reg-page/reg-page__components/player-control';
import store from './state/redux/store';
import ChessHistory from './chess-history';
import { TurnInfo } from './field/field-model';
import ModalWindow from '../../reg-page/modal-window';
import ModalContent from '../../reg-page/modal-content';
import getNextFigureColor from '../../../../utils/get-next-figure-color';
import ReplayDaoService from '../../../../services/replay-dao-service';
import { TimedMoveMessage } from '../../../../interfaces/move-message';
import { setWinner } from './state/redux/action-creators';
import FigureColor from '../../../../enums/figure-colors';
import Replay, { GameResult } from '../../../../interfaces/replay';
import { socketService } from '../../../../services/websocket-service';
import { TIMER_DELAY } from '../../../../config';

const IS_UPDATABLE = false;
class Chess extends BaseComponent {
  public onCellClick: (coords: Coordinate) => void = () => {};

  timer: Timer;

  private playerOne: PlayerContainer;

  private playerTwo: PlayerContainer;

  private chessBoard: ChessField;

  replayModel: ReplayDaoService;

  chessHistory: ChessHistory;

  isReplay: boolean;

  history: TimedMoveMessage[] = [];

  replay: Replay;

  constructor(parentNode: HTMLElement, isReplay: boolean) {
    super('div', ['chess-wrapper'], '', parentNode);
    this.isReplay = isReplay;
    this.replayModel = ReplayDaoService.getInstance();
    if (!isReplay) {
      this.createReplay();
    }
    this.timer = new Timer();
    this.timer.start(TIMER_DELAY);
    this.node.appendChild(this.timer.getNode());
    const chessBoardWrapper = new BaseComponent('div', ['chess'], '', this.node);
    const chessHead = new BaseComponent('div', ['chess__head'], '', chessBoardWrapper.getNode());
    this.playerOne = new PlayerContainer(store.getState().players.playerOne, IS_UPDATABLE);
    this.playerTwo = new PlayerContainer(store.getState().players.playerTwo, IS_UPDATABLE);
    const chessBody = new BaseComponent('div', ['chess__body'], '', chessBoardWrapper.getNode());
    this.chessHistory = new ChessHistory(chessBody.getNode());
    this.chessBoard = new ChessField(chessBody.getNode());
    socketService.onPlayerLeave = () => {
      this.setPlayerLeave();
    };
    socketService.onPlayerDrawSuggest = () => {
      const winContent = new ModalContent({
        header: 'Are you ok with draw?',
        text: `...`,
        buttonText: 'Ok',
      });
      const win = new ModalWindow(
        winContent,
        () => {
          socketService.answerDraw({ isDraw: true });
        },
        this.node,
        () => {
          socketService.answerDraw({ isDraw: false });
        },
      );
    };
    socketService.onPlayerDrawResponse = (result: boolean) => {
      if (result) {
        this.setDraw();
      } else {
        this.declineDraw();
      }
    };
    this.chessBoard.onEnd = () => {
      this.timer.toggle();
    };
    this.chessBoard.onMate = () => {
      store.dispatch(
        setWinner(getNextFigureColor(store.getState().currentPlayer.currentUserColor)),
      );
      this.setWinner(store.getState().winner.winnerColor);
      const winContent = new ModalContent({
        header: 'Check and mate!',
        text: `Player of ${
          store.getState().winner.winnerColor === FigureColor.BLACK ? 'white' : 'black'
        } has won!`,
        buttonText: 'Ok',
      });
      const win = new ModalWindow(winContent, () => {}, this.node);
    };
    this.chessBoard.onStalemate = () => {
      const winContent = new ModalContent({
        header: 'Stalemate!',
        text: `It isn't win, just a draw, bro.`,
        buttonText: "It's a pity!",
      });
      const win = new ModalWindow(winContent, () => {}, this.node);
      this.setWinner(store.getState().winner.winnerColor);
    };

    this.chessBoard.onFieldUpdate = (turnInfo: TurnInfo) => {
      this.chessHistory.setHistoryMove(turnInfo, this.timer.getTime());
      if (!isReplay) {
        this.history.push({
          from: turnInfo.move.from,
          to: turnInfo.move.to,
          time: this.timer.getSeconds(),
        });
      }
    };
    this.chessBoard.onNextTurn = () => this.nextTurnHandler();
    this.playerOne.toggleClass('current');

    chessHead.insertChilds([this.playerOne, this.playerTwo]);
  }

  declineDraw(): void {
    console.log(this, 'declineDraw');
  }

  setPlayerLeave(): void {
    const result = getNextFigureColor(store.getState().currentPlayer.currentUserColor);
    this.setWinner(result);
    const winContent = new ModalContent({
      header: 'User leaves!',
      text: `Player of ${result === FigureColor.WHITE ? 'white' : 'black'} has won!`,
      buttonText: 'Ok',
    });
    const win = new ModalWindow(winContent, () => {}, this.node);
  }

  setDraw(): void {
    const winContent = new ModalContent({
      header: 'Stalemate!',
      text: `It isn't win, just a draw, bro.`,
      buttonText: "It's a pity!",
    });
    const win = new ModalWindow(winContent, () => {}, this.node);
    this.setWinner('draw');
  }

  makeMove(from: Coordinate, to: Coordinate): void {
    this.chessBoard.model.makeMove(from.x, from.y, to.x, to.y);
  }

  setWinner(result: GameResult): void {
    this.replay.history = [...this.history];
    this.replay.result = result;
    this.replay.moves = this.history.length;
    this.replayModel.createReplayFromObject(this.replay);
    this.replay = null;
  }

  createReplay(): void {
    this.replay = {
      date: new Date().getTime(),
      history: [],
      mode: store.getState().gameMode.currentGameMode,
      players: [
        {
          name: store.getState().players.playerOne,
          color: store.getState().color.color,
          avatar: '',
        },
        {
          name: store.getState().players.playerTwo,
          color: getNextFigureColor(store.getState().color.color),
          avatar: '',
        },
      ],
      result: null,
      moves: 0,
    };
  }

  nextTurnHandler(): void {
    this.playerOne.toggleClass('current');
    this.playerTwo.toggleClass('current');
  }
}

export default Chess;
