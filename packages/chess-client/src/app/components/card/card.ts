import { p } from '@client/app/components/utils/p';
import { h4 } from '@client/app/components/utils';
import PlayerContainer from '@client/app/pages/reg-page/components/player-control';
import BaseComponent from '../base-component';
import Button from '../button/button';

export default class Card extends BaseComponent {
  private readonly cardButtonView: Button;

  private readonly playerOne: PlayerContainer;

  private readonly playerTwo: PlayerContainer;

  private readonly gameDescription: BaseComponent;

  constructor(
    firstPlayerName: string,
    secondPlayerName: string,
    date: number,
    moves: number,
    result: string,
    private readonly onViewClick: () => void,
  ) {
    super({ className: 'card' });
    const header = h4('headline', 'Replay');
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
      children: [
        p('card__text', `Date: ${new Date(date).toLocaleString()}`),
        p('card__text', `Moves: ${moves}`),
        p('card__text', result),
      ],
    });
    cardButtons.appendChildren([this.cardButtonView]);
    contentWrapper.appendChildren([this.playerOne, this.gameDescription, this.playerTwo]);
  }
}
