import Coordinate from '../../../../models/coordinate';
import BaseComponent from '../../../base-component';
import Timer from '../../../timer/timer';
import ChessField from './field/field-controller';
import PlayerContainer from '../../reg-page/reg-page__components/player-control';
import store from './state/redux/store';
import ChessHistory from './chess-history';
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
import TurnInfo from '../../../../interfaces/turn-info';
import FigureColorText from '../../../../enums/figure-color-text';

const IS_UPDATABLE = false;
class Chess extends BaseComponent {
  onCellClick: (coords: Coordinate) => void = () => {};

  private timer: Timer;

  private playerOne: PlayerContainer;

  private playerTwo: PlayerContainer;

  private chessBoard: ChessField;

  private replayModel: ReplayDaoService;

  private chessHistory: ChessHistory;

  private isReplay: boolean;

  private history: TimedMoveMessage[] = [];

  private replay: Replay;

  constructor(parentNode: HTMLElement, isReplay: boolean) {
    super('div', ['chess-wrapper'], '', parentNode);
    this.isReplay = isReplay;
    this.replayModel = ReplayDaoService.getInstance();
    if (!isReplay) {
      this.createReplay();
    }
    this.timer = new Timer();
    this.timer.start(TIMER_DELAY);
    this.node.append(this.timer.getNode());
    this.createUI();
    socketService.onPlayerLeave = () => {
      this.setPlayerLeave();
    };
    socketService.onPlayerDrawSuggest = () => {
      this.showDrawProposalModal();
    };
    socketService.onPlayerDrawResponse = (result: boolean) => {
      if (result) {
        this.setDraw();
      }
    };
    this.setUpChessBoardListeners(isReplay);
  }

  pushMoveToHistory(turnInfo: TurnInfo): void {
    this.history.push({
      from: turnInfo.move.from,
      to: turnInfo.move.to,
      time: this.timer.getSeconds(),
    });
  }

  setUpChessBoardListeners(isReplay: boolean): void {
    this.chessBoard.onEnd = () => {
      this.timer.toggle();
    };
    this.chessBoard.onMate = () => {
      store.dispatch(
        setWinner(getNextFigureColor(store.getState().currentPlayer.currentUserColor)),
      );
      this.setWinner(store.getState().winner.winnerColor);
      this.showMateModal();
    };
    this.chessBoard.onStalemate = () => {
      this.showStalemateModal();
      this.setWinner(store.getState().winner.winnerColor);
    };
    this.chessBoard.onFieldUpdate = (turnInfo: TurnInfo) => {
      this.chessHistory.setHistoryMove(turnInfo, this.timer.getTime());
      if (!isReplay) {
        this.pushMoveToHistory(turnInfo);
      }
    };
    this.chessBoard.onNextTurn = () => this.nextTurnHandler();
  }

  createUI(): void {
    const chessBoardWrapper = new BaseComponent('div', ['chess'], '', this.node);
    const chessHead = new BaseComponent('div', ['chess__head'], '', chessBoardWrapper.getNode());
    this.playerOne = new PlayerContainer(store.getState().players.playerOne, IS_UPDATABLE);
    this.playerTwo = new PlayerContainer(store.getState().players.playerTwo, IS_UPDATABLE);
    const chessBody = new BaseComponent('div', ['chess__body'], '', chessBoardWrapper.getNode());
    this.chessHistory = new ChessHistory(chessBody.getNode());
    this.chessBoard = new ChessField(chessBody.getNode());
    this.playerOne.toggleClass('current');
    chessHead.insertChilds([this.playerOne, this.playerTwo]);
  }

  showDrawProposalModal(): void {
    const winContent = new ModalContent({
      header: 'Are you ok with draw?',
      text: `...`,
      buttonText: 'Ok',
    });
    const modalWindow = new ModalWindow(
      winContent,
      () => {
        socketService.answerDraw({ isDraw: true });
      },
      this.node,
      () => {
        socketService.answerDraw({ isDraw: false });
      },
    );
  }

  showStalemateModal(): void {
    const winContent = new ModalContent({
      header: 'Stalemate!',
      text: `It isn't win, just a draw, bro.`,
      buttonText: "It's a pity!",
    });
    const modalWindow = new ModalWindow(winContent, () => {}, this.node);
  }

  showMateModal(): void {
    const winContent = new ModalContent({
      header: 'Check and mate!',
      text: `Player of ${
        store.getState().winner.winnerColor === FigureColor.BLACK
          ? FigureColorText.WHITE
          : FigureColorText.BLACK
      } has won!`,
      buttonText: 'Ok',
    });
    const modalWindow = new ModalWindow(winContent, () => {}, this.node);
  }

  setPlayerLeave(): void {
    const result = getNextFigureColor(store.getState().currentPlayer.currentUserColor);
    this.setWinner(result);
    const winContent = new ModalContent({
      header: 'User leaves!',
      text: `Player of ${
        result === FigureColor.WHITE ? FigureColorText.WHITE : FigureColorText.BLACK
      } has won!`,
      buttonText: 'Ok',
    });
    const modalWindow = new ModalWindow(winContent, () => {}, this.node);
  }

  setDraw(): void {
    const winContent = new ModalContent({
      header: 'Stalemate!',
      text: `It isn't win, just a draw, bro.`,
      buttonText: "It's a pity!",
    });
    const modalWindow = new ModalWindow(winContent, () => {}, this.node);
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

  stopTimer(): void {
    this.timer.toggle();
  }

  nextTurnHandler(): void {
    this.playerOne.toggleClass('current');
    this.playerTwo.toggleClass('current');
  }
}

export default Chess;
