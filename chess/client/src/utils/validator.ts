export default class Validator {
  static isEmail(str: string): boolean {
    return /^[\wа-яё.!#$%&’*+=?^_`{|}~-]+@[\wа-яё-]+\.{1}[\wа-яё-]+]*$/i.test(str);
  }

  static isOnlyDigits(str: string): boolean {
    return /^\d+$/.test(str);
  }

  static isEnoughLength(str: string): boolean {
    return /^([a-zа-яё\d]|\s){1,30}$/gi.test(str);
  }

  static isEmpty(str: string): boolean {
    return str.trim() === '';
  }

  static isValidName(name: string): boolean {
    return (
      Validator.isOnlyDigits(name) || !Validator.isEnoughLength(name) || Validator.isEmpty(name)
    );
  }

  static validateFirstName(input: HTMLInputElement): boolean {
    if (Validator.isValidName(input.value)) {
      input.setCustomValidity(`- Имя не может быть пустым. \n
      - Имя не может состоять из цифр. \n
      - Имя не может содержать служебные символы (~ ! @ # $ % * () _ — + = | : ; " ' \` < > , . ? / ^).`);
      return false;
    }
    input.setCustomValidity('');
    return true;
  }

  static validateLastName(input: HTMLInputElement): boolean {
    if (Validator.isValidName(input.value)) {
      input.setCustomValidity(`- Фамилия не может быть пустой.
      - Фамилия не может состоять из цифр.
      - Фамилия не может содержать служебные символы. (~ ! @ # $ % * () _ — + = | : ; " ' \` < > , . ? / ^)
      `);
      return false;
    }
    input.setCustomValidity('');
    return true;
  }

  static validateEmail(input: HTMLInputElement): boolean {
    if (!Validator.isEmail(input.value)) {
      input.setCustomValidity(`- email не может быть пустым.
      - должен соответствовать стандартному правилу формированию email`);
      return false;
    }
    input.setCustomValidity('');
    return true;
  }
}
