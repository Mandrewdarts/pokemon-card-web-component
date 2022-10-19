import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pokemon-card')
export class PokemonCardHTMLElement extends LitElement {
  render() {
    return html` <h1>Pokemon Card!</h1> `;
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    'pokemon-card': PokemonCardHTMLElement;
  }
}
