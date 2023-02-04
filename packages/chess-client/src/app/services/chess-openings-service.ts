import eco from '../../assets/eco.json';
import type ChessOpening from '../interfaces/chess-opening';
import getFirstSplitElement from '../utils/string-splitter';

export default function getOpeningName(fen: string): string {
  const opening = (eco as ChessOpening[]).find(
    (pack) => getFirstSplitElement(pack.fen, ' ') === fen,
  );
  return opening ? getFirstSplitElement(opening.name, ',') : '';
}
