function isOnlyDigits(str: string): boolean {
  return /^\d+$/.test(str);
}

function isEnoughLength(str: string): boolean {
  return /^([a-zа-яё\d]|\s){1,30}$/gi.test(str);
}

function isEmpty(str: string): boolean {
  return str.trim() === '';
}

function isValidName(name: string): boolean {
  return isOnlyDigits(name) || !isEnoughLength(name) || isEmpty(name);
}

export function validateFirstName(input: HTMLInputElement): boolean {
  if (isValidName(input.value)) {
    input.setCustomValidity(`- Имя не может быть пустым. \n
      - Имя не может состоять из цифр. \n
      - Имя не может содержать служебные символы (~ ! @ # $ % * () _ — + = | : ; " ' \` < > , . ? / ^).`);
    return false;
  }
  input.setCustomValidity('');
  return true;
}
