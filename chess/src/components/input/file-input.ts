import Input from './input';

export default class FileInput extends Input {
  getFile(): File {
    return this.input.files[0];
  }
}
