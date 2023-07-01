import type ChessOpening from '../interfaces/chess-opening';
import getFirstSplitElement from '../utils/string-splitter';
import { api } from '../config';

export default async function getOpeningName(fen: string): Promise<string> {
  const eco = (await api.get('/assets/eco.json')).data;
  console.log(eco);
  const opening = (eco as ChessOpening[]).find(
    (pack) => getFirstSplitElement(pack.fen, ' ') === fen,
  );
  return opening ? getFirstSplitElement(opening.name, ',') : '';
}
