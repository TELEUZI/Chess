import { Coordinate } from '@chess/coordinate';
import { storeService, type FieldState, type FigureModel } from '@chess/game-engine';
import { isMultipleStepRightMove } from './multiple-step-figure';

export function getMultipleStepPerTurnMoves(
  initialMoves: Coordinate[],
  {
    state,
    figure,
    fromX,
    fromY,
  }: {
    state: FieldState;
    figure: FigureModel;
    fromX: number;
    fromY: number;
  },
): Coordinate[] {
  const moves: Coordinate[] = [];
  initialMoves.forEach((move) => {
    let posX = fromX;
    let posY = fromY;
    do {
      posX += move.x;
      posY += move.y;
      if (isMultipleStepRightMove(state, figure, posX, posY)) {
        moves.push(new Coordinate(posX, posY));
      }
    } while (
      isMultipleStepRightMove(state, figure, posX, posY) &&
      !storeService.getFieldState().getCellAt(posX, posY)?.getFigure()
    );
  });
  return moves;
}
