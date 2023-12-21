export function getRandomIntegerInRange(rightBorder: number, leftBorder = 0): number {
  return Math.floor(Math.random() * rightBorder + leftBorder);
}
