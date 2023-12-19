import BaseComponent from '@client/app/components/base-component';
import Button from '@client/app/components/button/button';
import PlayerContainer from './components/player-control';
import StartPageView from './start-page-view';

describe('StartPageView', () => {
  // Renders the StartPageView component with player containers and game control buttons
  it('should render the StartPageView component with player containers and game control buttons', () => {
    const onStartSingleGame = vi.fn();
    const onStartGameWithBot = vi.fn();
    const onStartMultiplayerGame = vi.fn();
    const onUserNameChanged = vi.fn();

    const startPageView = new StartPageView(
      onStartSingleGame,
      onStartGameWithBot,
      onStartMultiplayerGame,
      onUserNameChanged,
    );

    expect(startPageView).toBeDefined();
    expect(startPageView.playerOne).toBeInstanceOf(PlayerContainer);
    expect(startPageView.playerTwo).toBeInstanceOf(PlayerContainer);
    expect(startPageView.startButton).toBeInstanceOf(Button);
    expect(startPageView.gameModeButton).toBeInstanceOf(Button);
    expect(startPageView.startGameWithBot).toBeInstanceOf(Button);
    expect(startPageView.gameControlButtons).toBeInstanceOf(BaseComponent);
  });

  // Clicking on 'Play offline' button triggers onStartSingleGame callback
  it('should trigger onStartSingleGame callback when "Play offline" button is clicked', () => {
    const onStartSingleGame = vi.fn();
    const onStartGameWithBot = vi.fn();
    const onStartMultiplayerGame = vi.fn();
    const onUserNameChanged = vi.fn();

    const startPageView = new StartPageView(
      onStartSingleGame,
      onStartGameWithBot,
      onStartMultiplayerGame,
      onUserNameChanged,
    );

    const playOfflineButton = startPageView.startButton.getNode();
    playOfflineButton.click();

    expect(onStartSingleGame).toHaveBeenCalled();
  });

  // Clicking on 'Play with computer' button triggers onStartGameWithBot callback
  it('should trigger onStartGameWithBot callback when "Play with computer" button is clicked', () => {
    const onStartSingleGame = vi.fn();
    const onStartGameWithBot = vi.fn();
    const onStartMultiplayerGame = vi.fn();
    const onUserNameChanged = vi.fn();

    const startPageView = new StartPageView(
      onStartSingleGame,
      onStartGameWithBot,
      onStartMultiplayerGame,
      onUserNameChanged,
    );

    const playWithComputerButton = startPageView.startGameWithBot.getNode();
    playWithComputerButton.click();

    expect(onStartGameWithBot).toHaveBeenCalled();
  });
});
