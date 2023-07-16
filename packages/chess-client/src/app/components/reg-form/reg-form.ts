import BaseComponent from '../base-component';
import Input from '../input/input';
import Validator from '../../utils/validator';
import FileInput from '../input/file-input';

export default class RegForm extends BaseComponent {
  nameInput: Input;

  submit: Input;

  inputs: Input[] = [];

  reset: Input;

  image: FileInput;

  constructor(
    classlist: string[],
    private readonly onSubmit: (str: string[], avatar: File | null) => void,
  ) {
    super('form', ['form', 'container__child', 'signup__form', ...classlist], '');
    this.setAttribute('action', '');
    const formGroup = new BaseComponent('div', ['form-group']);
    const label = new BaseComponent('label', ['label'], 'Username');
    this.nameInput = new Input('text', [], 'Name');
    formGroup.insertChilds([label, this.nameInput]);
    this.insertChild(formGroup);
    this.submit = new Input('submit', ['btn--form'], '', 'Submit');
    this.reset = new Input('reset', ['btn--form'], '', 'Reset');
    this.image = new FileInput('file', [], 'Avatar');
    this.image.setAttribute('accept', 'image/*');
    this.inputs.push(this.nameInput);
    this.insertChilds([...this.inputs, this.submit, this.reset, this.image]);
    this.nameInput.setHandler((input) => Validator.validateFirstName(input));
    this.submit.setAttribute('disabled', 'true');
    this.addUserInputListeners();
  }

  addUserInputListeners(): void {
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

  onValidate(): void {
    if (this.inputs.every((el) => el.isValid)) {
      this.submit.removeAttribute('disabled');
    }
  }
}
