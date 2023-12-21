import { TABLE_SIZE } from '@chess/config';
import { FieldState } from '../field-state';
import { createFigureFromString } from './figure-fabric';
import { CellModel } from '../models';

export function createFieldFromStrings(stringState: string[][]): FieldState {
  const newState = [];
  for (let i = 0; i < TABLE_SIZE; i += 1) {
    const row = [];
    for (let j = 0; j < TABLE_SIZE; j += 1) {
      const cell = new CellModel(createFigureFromString(stringState[i][j]));
      row.push(cell);
    }
    newState.push(row);
  }
  return new FieldState(newState);
}
