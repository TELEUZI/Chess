import GameDifficultyOptions from '../../../../../enums/game-difficulty-options';
import { Strategy } from '../../../../../interfaces/bot-strategy';
import GameConfig from '../../../../../interfaces/game-config';
import EvaluationStrategy from '../field/chess-bot-strategies/eval-strategy';
import MinMaxBotStrategy from '../field/chess-bot-strategies/min-max-strategy';
import RandomMoveStrategy from '../field/chess-bot-strategies/random-move-strategy';

export default function createStrategy(config: GameConfig): Strategy {
  let strategy: Strategy;
  switch (config.GameDifficulty) {
    case GameDifficultyOptions.easy:
      strategy = new RandomMoveStrategy();
      break;
    case GameDifficultyOptions.medium:
      strategy = new EvaluationStrategy();
      break;
    case GameDifficultyOptions.hard:
      strategy = new MinMaxBotStrategy();
      break;
    default:
      break;
  }
  return strategy || null;
}
