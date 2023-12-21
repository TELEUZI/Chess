export const FigureWeight = {
  PAWN: 10,
  ROOK: 50,
  KNIGHT: 30,
  BISHOP: 30,
  QUEEN: 90,
  KING: 900,
} as const;

export type FigureWeightKeys = keyof typeof FigureWeight;
export type FigureWeightValues = (typeof FigureWeight)[FigureWeightKeys];
