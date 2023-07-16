import type ChessOpening from '../interfaces/chess-opening';
import getFirstSplitElement from '../utils/string-splitter';
import { api } from '../config';

export default async function getOpeningName(fen: string): Promise<string> {
  const eco: ChessOpening[] = (await api.get('/assets/eco.json')).data;
  const opening = eco.find((pack) => getFirstSplitElement(pack.fen, ' ') === fen);
  return opening ? getFirstSplitElement(opening.name, ',') : '';
}
