import PlayerContainer from '../../pages/reg-page/reg-page__components/player-control';
import BaseComponent from '../base-component';
import Button from '../button/button';

export default class Card extends BaseComponent {
  private readonly cardButtonView: Button;

  private readonly playerOne: PlayerContainer;

  private readonly playerTwo: PlayerContainer;

  private readonly gameDescription: BaseComponent;

  onViewClick: () => void;

  constructor(
    firstPlayerName: string,
    secondPlayerName: string,
    date: number,
    moves: number,
    result: string,
    onViewClick: () => void,
  ) {
    super('div', ['card']);
    const header = new BaseComponent('h4', ['headline'], 'Replay');
    this.insertChild(header);
    const contentWrapper = new BaseComponent('div', ['card__content'], '', this.node);
    this.cardButtonView = new Button(
      'View',
      () => {
        this.onViewClick();
      },
      ['button--orange'],
    );
    const cardButtons = new BaseComponent('div', ['card__buttons'], '', this.node);
    this.playerOne = new PlayerContainer(firstPlayerName, false);
    this.playerTwo = new PlayerContainer(secondPlayerName, false);
    this.gameDescription = new BaseComponent('div', ['card__desc'], '');
    this.gameDescription.insertChilds([
      new BaseComponent('p', ['card__text'], `Date: ${new Date(date).toLocaleString()}`),
      new BaseComponent('p', ['card__text'], `Moves: ${moves}`),
      new BaseComponent('p', ['card__text'], result),
    ]);
    cardButtons.insertChilds([this.cardButtonView]);
    contentWrapper.insertChilds([this.playerOne, this.gameDescription, this.playerTwo]);
    this.onViewClick = onViewClick;
  }
}
