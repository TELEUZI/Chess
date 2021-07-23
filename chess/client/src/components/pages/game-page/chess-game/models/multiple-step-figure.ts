import FigureType from '../../../../../enums/figure-type';
import Coordinate from '../../../../../models/coordinate';
import FieldState from '../state/field-state';
import FigureModel from './figures/figure-model';

export default abstract class MultipleStepFigure {
  moves: Coordinate[];

  static isRightMove(state: FieldState, figure: FigureModel, posX: number, posY: number): boolean {
    return (
      state.getCellAt(posX, posY) &&
      (state.getCellAt(posX, posY).getFigure() === null ||
        state.getFigureColor(posX, posY) !== figure.getColor())
      // state.getCellAt(posX, posY).getFigureType() !== FigureType.KING))
    );
  }
}
