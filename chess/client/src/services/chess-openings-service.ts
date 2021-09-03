import eco from '../../eco.json';
import ChessOpening from '../interfaces/chess-opening';
import getFirstSplitElement from '../utils/string-splitter';

export default async function getOpeningName(fen: string): Promise<string> {
  const opening = (eco as ChessOpening[]).find(
    (pack) => getFirstSplitElement(pack.fen, ' ') === fen,
  );
  return opening ? getFirstSplitElement(opening.name, ',') : '';
}
