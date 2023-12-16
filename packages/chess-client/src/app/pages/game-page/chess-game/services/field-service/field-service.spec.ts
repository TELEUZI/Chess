import FieldState from "@client/app/pages/game-page/chess-game/state/field-state";
import CellModel from "@client/app/pages/game-page/chess-game/models/cell-model";
import FigureModel from "@client/app/pages/game-page/chess-game/models/figures/figure-model";
import FigureType from "@client/app/enums/figure-type";
import { FigureColor } from "@chess/game-common";
import { Coordinate } from "@chess/coordinate";
import { exchangePositions } from "@client/app/pages/game-page/chess-game/services/field-service/field-service";

describe('exchangePositions', () => {

  // Given a valid 'state', 'from' and 'to' coordinates, it should exchange the positions of the figures in the cells represented by the coordinates
  it('should exchange positions of figures when given valid state, from and to coordinates', () => {
    // Arrange
    const state = new FieldState([
      [new CellModel(new FigureModel(FigureColor.WHITE, FigureType.PAWN, )), new CellModel(null)],
      [new CellModel(null), new CellModel(new FigureModel(FigureColor.BLACK, FigureType.PAWN, ))]
    ]);
    const from = new Coordinate(0, 0);
    const to = new Coordinate(1, 1);

    // Act
    exchangePositions(state, from, to);

    // Assert
    expect(state.getFigure(0, 0)).toBeNull();
    expect(state.getFigure(1, 1)?.getType()).toBe(FigureType.PAWN);
    expect(state.getFigure(1, 1)?.getColor()).toBe(FigureColor.WHITE);
  });

  // Given a 'state' where the 'from' cell is empty, it should not modify the state
  it('should not modify the state when the \'from\' cell is empty', () => {
    // Arrange
    const state = new FieldState([
      [new CellModel(null), new CellModel(new FigureModel(FigureColor.WHITE, FigureType.PAWN, ))],
      [new CellModel(null), new CellModel(new FigureModel(FigureColor.BLACK, FigureType.PAWN, ))]
    ]);
    const from = new Coordinate(0, 0);
    const to = new Coordinate(1, 1);

    // Act
    exchangePositions(state, from, to);

    // Assert
    expect(state.getFigure(0, 0)).toBeNull();
    expect(state.getFigure(1, 1)?.getType()).toBe(FigureType.PAWN);
    expect(state.getFigure(1, 1)?.getColor()).toBe(FigureColor.BLACK);
  });

  // Given a 'state' where the 'to' cell is occupied by a figure of the same color as the figure in the 'from' cell, it should not modify the state
  it('should not modify the state when the \'to\' cell is occupied by a figure of the same color as the \'from\' cell', () => {
    // Arrange
    const state = new FieldState([
      [new CellModel(new FigureModel(FigureColor.WHITE, FigureType.PAWN, )), new CellModel(new FigureModel(FigureColor.WHITE, FigureType.PAWN, ))],
      [new CellModel(null), new CellModel(new FigureModel( FigureColor.BLACK,FigureType.PAWN,))]
    ]);
    const from = new Coordinate(0, 0);
    const to = new Coordinate(0, 1);

    // Act
    exchangePositions(state, from, to);

    // Assert
    expect(state.getFigure(0, 0)?.getType()).toBe(FigureType.PAWN);
    expect(state.getFigure(0, 0)?.getColor()).toBe(FigureColor.WHITE);
    expect(state.getFigure(0, 1)?.getType()).toBe(FigureType.PAWN);
    expect(state.getFigure(0, 1)?.getColor()).toBe(FigureColor.WHITE);
  });

  // Given a 'state' where the 'from' or 'to' coordinates are outside the bounds of the state, it should not modify the state
  it('should not modify the state when the \'from\' or \'to\' coordinates are outside the bounds of the state', () => {
    // Arrange
    const state = new FieldState([
      [new CellModel(new FigureModel(FigureColor.WHITE, FigureType.PAWN, )), new CellModel(new FigureModel(FigureColor.WHITE , FigureType.PAWN,))],
      [new CellModel(null), new CellModel(new FigureModel( FigureColor.BLACK, FigureType.PAWN,))]
    ]);
    const from = new Coordinate(0, 0);
    const to = new Coordinate(8, 8);

    // Act
    exchangePositions(state, from, to);

    // Assert
    expect(state.getFigure(0, 0)?.getType()).toBe(FigureType.PAWN);
    expect(state.getFigure(0, 0)?.getColor()).toBe(FigureColor.WHITE);
    expect(state.getFigure(8, 8)).toBeNull();
  });

  // Given a 'state' where the 'from' or 'to' coordinates are negative, it should not modify the state
  it('should not modify the state when the \'from\' or \'to\' coordinates are negative', () => {
    // Arrange
    const state = new FieldState([
      [new CellModel(new FigureModel(FigureColor.WHITE, FigureType.PAWN, )), new CellModel(new FigureModel( FigureColor.WHITE, FigureType.PAWN,))],
      [new CellModel(null), new CellModel(new FigureModel(FigureColor.BLACK, FigureType.PAWN))]
    ]);
    const from = new Coordinate(-1, 0);
    const to = new Coordinate(0, -1);

    // Act
    exchangePositions(state, from, to);

    // Assert
    expect(state.getFigure(-1, 0)).toBeNull();
    expect(state.getFigure(0, -1)).toBeNull();
  });

  // Given a 'state' where the 'from' or 'to' coordinates are non-integer, it should not modify the state
  it('should not modify the state when the \'from\' or \'to\' coordinates are non-integer', () => {
    // Arrange
    const state = new FieldState([
      [new CellModel(new FigureModel(FigureColor.WHITE, FigureType.PAWN, )), new CellModel(new FigureModel( FigureColor.WHITE, FigureType.PAWN,))],
      [new CellModel(null), new CellModel(new FigureModel(FigureColor.BLACK, FigureType.PAWN, ))]
    ]);
    const from = new Coordinate(0.5, 0);
    const to = new Coordinate(0, 1.5);

    // Act
    exchangePositions(state, from, to);

    // Assert
    expect(state.getFigure(0.5, 0)).toBeNull();
    expect(state.getFigure(0, 1.5)).toBeNull();
  });

});
