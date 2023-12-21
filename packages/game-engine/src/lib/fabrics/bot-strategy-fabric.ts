import type { GameConfig } from '@chess/game-common';
import { GameDifficultyOptions } from '@chess/game-common';
import type { Strategy } from '../services/chess-bot/bot-strategy';
import { RandomMoveStrategy, EvaluationStrategy, MinMaxBotStrategy } from '../services';

const gameDifficultyOptions: Record<GameDifficultyOptions, Strategy> = {
  [GameDifficultyOptions.easy]: new RandomMoveStrategy(),
  [GameDifficultyOptions.medium]: new EvaluationStrategy(),
  [GameDifficultyOptions.hard]: new MinMaxBotStrategy(),
};
export function createStrategy(config: GameConfig): Strategy | null {
  return gameDifficultyOptions[config.GameDifficulty];
}
