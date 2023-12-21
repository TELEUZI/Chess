import { api } from '@chess/config';
import type { ChessOpening } from '@chess/game-common';
import { getFirstSplitElement } from '@chess/utils';

export function getOpeningName(eco: ChessOpening[], fen: string): string {
  try {
    const opening = eco.find((pack) => getFirstSplitElement(pack.fen, ' ') === fen);
    return opening ? getFirstSplitElement(opening.name, ',') : '';
  } catch (error) {
    return '';
  }
}

export async function getOpenings(): Promise<ChessOpening[]> {
  try {
    const result = await api.get<ChessOpening[]>('/assets/eco.json');
    return result.data;
  } catch (error) {
    return [];
  }
}
