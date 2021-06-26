import BaseComponent from '../base-component';
import Input from '../input/input';
import Validator from '../../shared/validator';
import Form from '../../interfaces/form';
import FileInput from '../input/file-input';

export default class RegForm extends BaseComponent implements Form<Validator> {
  nameInput: Input;

  submit: Input;

  inputs: Input[] = [];

  onSubmit: (str: string[], avatar: File) => void;

  reset: Input;

  image: Input;

  constructor(classlist: string[]) {
    super('form', ['form', ...classlist], '');
    this.setAttribute('action', '');
    this.createFormComponents();
    this.inputs.push(this.nameInput);
    this.createUI();
    this.setUpInputHandlers();
    this.submit.setAttribute('disabled', 'true');
    this.addUserInputListeners();
  }

  addUserInputListeners(): void {
    this.addListener('input', () => {
      this.onValidate();
    });
    this.submit.addListener('click', (e: Event) => {
      e.preventDefault();
      this?.onSubmit(
        this.inputs.map((input) => input.getValue()),
        this.image.getFile() || null,
      );
    });
  }

  onValidate(): void {
    if (this.inputs.every((el) => el.isValid)) {
      this.submit.removeAttribute('disabled');
    }
  }

  setUpInputHandlers(): void {
    this.nameInput.setHandler(Validator.validateFirstName);
  }

  private createFormComponents(): void {
    this.nameInput = new Input('text', [], 'Name');
    this.submit = new Input('submit', [], '', 'Submit');
    this.reset = new Input('reset', [], 'Reset');
    this.image = new FileInput('file', [], 'Avatar');
    this.image.setAttribute('accept', 'image/*');
  }

  private createUI(): void {
    this.insertChilds([...this.inputs, this.submit, this.reset, this.image]);
  }
}
