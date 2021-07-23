import FieldState from '../components/pages/game-page/chess-game/state/field-state';
import FigureColor from '../enums/figure-colors';
import MoveMessage, { FigureTurn } from './move-message';

export interface Strategy {
  getBestMove(state: FieldState, color: FigureColor, avaliableMoves: FigureTurn[]): MoveMessage;
}
