import BaseComponent from '../components/base-component';
import Input from '../components/input/input';

export default interface Form<Validator> extends BaseComponent {
  onSubmit: (str: string[], avatar?: File) => void;
  onValidate(): void;
  inputs: Input[];
  setUpInputHandlers(arg0: Validator): void;
}
