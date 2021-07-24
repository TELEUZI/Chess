import FieldState from '../state/field-state';
import Pawn from './figures/pawn';

export default abstract class OneStepFigure {
  static isEnemyOnDiagonal(state: FieldState, pawn: Pawn, posX: number, posY: number): boolean {
    return (
      state.getCellAt(posX, posY) &&
      state.getCellAt(posX, posY).getFigure() &&
      state.getFigureColor(posX, posY) !== pawn.getColor()
    );
  }

  static isRightMove(state: FieldState, posX: number, posY: number): boolean {
    return state.getCellAt(posX, posY) && !state.getCellAt(posX, posY).getFigure();
  }
}
