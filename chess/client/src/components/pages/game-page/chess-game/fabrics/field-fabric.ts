import CellModel from '../models/cell-model';
import FieldState from '../state/field-state';
import { createFigurefromString } from './figure-fabric';

export default function createFieldFromStrings(stringState: string[][]): FieldState {
  const newState = [];
  for (let i = 0; i < 8; i += 1) {
    const row = [];
    for (let j = 0; j < 8; j += 1) {
      const cell = new CellModel(createFigurefromString(stringState[i][j]));
      row.push(cell);
    }
    newState.push(row);
  }
  return new FieldState(newState);
}
