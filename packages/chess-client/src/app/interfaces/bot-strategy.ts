import type FieldState from '../components/pages/game-page/chess-game/state/field-state';
import type FigureColor from '../enums/figure-colors';
import type { FigureTurn } from './move-message';
import type MoveMessage from './move-message';

export interface Strategy {
  getBestMove: (state: FieldState, color: FigureColor, avaliableMoves: FigureTurn[]) => MoveMessage;
}
