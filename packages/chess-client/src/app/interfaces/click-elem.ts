import type BaseComponent from '../components/base-component';

export default interface ClickElement extends BaseComponent {
  onClick: () => void;
}
