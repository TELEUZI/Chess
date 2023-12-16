import type FieldState from '../state/field-state';
import type Pawn from './figures/pawn';

export default abstract class OneStepFigure {
  public static isEnemyOnDiagonal(
    state: FieldState,
    pawn: Pawn,
    posX: number,
    posY: number,
  ): boolean {
    const cell = state.getCellAt(posX, posY);
    return !!(cell?.getFigure() && state.getFigureColor(posX, posY) !== pawn.getColor());
  }

  public static isRightMove(state: FieldState, posX: number, posY: number): boolean {
    const cell = state.getCellAt(posX, posY);
    return !!(cell && !cell.getFigure());
  }
}
