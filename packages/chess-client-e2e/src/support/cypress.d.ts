declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  declare interface Chainable {
    login: (email: string, password: string) => void;
  }
}
