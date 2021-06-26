import BaseComponent from '../../base-component';
import CustomImage from '../../menu/icon/image';
import BASE_LOGO from '../../../assets/icons/ava.png';
import UserDaoService from '../../../models/user-dao-service';
import PageController from '../../../interfaces/page';

export default class BestScorePage implements PageController {
  private root: HTMLElement;

  private model: UserDaoService;

  constructor(root: HTMLElement) {
    this.root = root;
    this.model = UserDaoService.getInstance();
  }

  async createPage(): Promise<void> {
    this.showResult();
  }

  private async showResult(): Promise<void> {
    const result = await this.model.getSorted();
    const res: BaseComponent[] = [];
    result.forEach((el) => {
      res.push(
        new BaseComponent('div', ['result'], `${el.name} ${el.score}`),
        new CustomImage(el.avatar || BASE_LOGO, ['avatar']),
      );
    });
    res.forEach((el) => this.root.appendChild(el.getNode()));
  }
}
