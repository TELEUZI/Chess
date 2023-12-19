import GameDifficultyOptions from '@client/app/enums/game-difficulty-options';
import type { Strategy } from '@client/app/pages/game-page/chess-game/services/chess-bot/bot-strategy';
import type GameConfig from '@client/app/interfaces/game-config';
import EvaluationStrategy from '@client/app/pages/game-page/chess-game/services/chess-bot/chess-bot-strategies/eval-strategy';
import MinMaxBotStrategy from '@client/app/pages/game-page/chess-game/services/chess-bot/chess-bot-strategies/min-max-strategy';
import RandomMoveStrategy from '@client/app/pages/game-page/chess-game/services/chess-bot/chess-bot-strategies/random-move-strategy';

const gameDifficultyOptions: Record<GameDifficultyOptions, Strategy> = {
  [GameDifficultyOptions.easy]: new RandomMoveStrategy(),
  [GameDifficultyOptions.medium]: new EvaluationStrategy(),
  [GameDifficultyOptions.hard]: new MinMaxBotStrategy(),
};
export default function createStrategy(config: GameConfig): Strategy | null {
  return gameDifficultyOptions[config.GameDifficulty];
}
