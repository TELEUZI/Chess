import { p } from '@client/app/components/utils/p';
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
    super({ className: 'card' });
    const header = new BaseComponent({
      tag: 'h4',
      className: 'headline',
      content: 'Replay',
    });
    this.append(header);
    const contentWrapper = new BaseComponent({
      tag: 'div',
      className: 'card__content',
      parent: this.node,
    });
    this.cardButtonView = new Button(
      'View',
      () => {
        this.onViewClick();
      },
      ['button--orange'],
    );
    const cardButtons = new BaseComponent({
      className: 'card__buttons',
      parent: this.node,
    });
    this.playerOne = new PlayerContainer(firstPlayerName, false);
    this.playerTwo = new PlayerContainer(secondPlayerName, false);
    this.gameDescription = new BaseComponent({
      tag: 'div',
      className: 'card__desc',
    });
    this.gameDescription.appendChildren([
      p('card__text', `Date: ${new Date(date).toLocaleString()}`),
      p('card__text', `Moves: ${moves}`),
      p('card__text', result),
    ]);
    cardButtons.appendChildren([this.cardButtonView]);
    contentWrapper.appendChildren([this.playerOne, this.gameDescription, this.playerTwo]);
    this.onViewClick = onViewClick;
  }
}
