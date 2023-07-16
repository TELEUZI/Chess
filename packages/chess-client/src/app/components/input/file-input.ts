import Input from './input';

export default class FileInput extends Input {
  getFile(): File | null {
    return this.input.files?.[0] ?? null;
  }
}
