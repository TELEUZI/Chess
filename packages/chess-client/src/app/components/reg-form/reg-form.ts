import BaseComponent from '../base-component';
import Input from '../input/input';
import { validateFirstName } from '../../utils/validator';
import FileInput from '../input/file-input';

export default class RegForm extends BaseComponent<'form'> {
  private readonly nameInput: Input;

  private readonly submit: Input;

  private readonly inputs: Input[] = [];

  private readonly reset: Input;

  private readonly image: FileInput;

  constructor(
    classlist: string[],
    private readonly onSubmit: (str: string[], avatar: File | null) => void,
  ) {
    super({
      tag: 'form',
      className: ['form', 'container__child', 'signup__form', ...classlist].join(' '),
    });
    this.setAttribute('action', '');
    const formGroup = new BaseComponent({ tag: 'div', className: 'form__group' });
    const label = new BaseComponent({ tag: 'label', className: 'form__label', content: 'Name' });
    this.nameInput = new Input('text', [], 'Name');
    formGroup.appendChildren([label, this.nameInput]);
    this.append(formGroup);
    this.submit = new Input('submit', ['btn--form'], '', 'Submit');
    this.reset = new Input('reset', ['btn--form'], '', 'Reset');
    this.image = new FileInput('file', [], 'Avatar');
    this.image.setAttribute('accept', 'image/*');
    this.inputs.push(this.nameInput);
    this.appendChildren([...this.inputs, this.submit, this.reset, this.image]);
    this.nameInput.setHandler((input) => validateFirstName(input));
    this.submit.setAttribute('disabled', 'true');
    this.addUserInputListeners();
  }

  private addUserInputListeners(): void {
    this.addListener('input', () => {
      this.onValidate();
    });
    this.submit.addListener('click', (e: Event | undefined) => {
      e?.preventDefault();
      this.onSubmit(
        this.inputs.map((input) => input.getValue()),
        this.image.getFile() ?? null,
      );
    });
  }

  private onValidate(): void {
    if (this.inputs.every((el) => el.isValid)) {
      this.submit.removeAttribute('disabled');
    }
  }
}
