import { Coordinate } from '@chess/coordinate';
import type { FieldState, FigureModel } from '@chess/game-engine';
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
      !state.getCellAt(posX, posY)?.getFigure()
    );
  });
  return moves;
}
