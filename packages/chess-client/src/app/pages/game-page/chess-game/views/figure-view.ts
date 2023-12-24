import type { PropertyValues, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Proof of concept, could be removed later
@customElement('figure-view')
export class FigureView extends LitElement {
  @property({ reflect: true }) public class: string | undefined;

  constructor() {
    super();
    this.classList.add('figure');
    this.classList.add('chess__figure');
  }

  public willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('class')) {
      this.classList.add('figure');
      this.classList.add('chess__figure');
    }
  }

  // Declare reactive properties
  // Render the UI as a function of component state
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/class-methods-use-this
  public render(): TemplateResult {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'figure-view': FigureView;
  }
}
