import { css } from './css';
import { fetchPokemon } from './pokemon-service';
import sheet from './index.css' assert { type: 'css' };
const html = String.raw;

const styles = css(sheet);

/**
 * @element pokemon-card
 *
 * @example <pokemon-card character="bulbasaur"></pokemon-card>
 *
 * @attr {String} character - This takes the name of the pokemon character. Example character="mew" or as a property document.querySelector('pokemon-card').character = "mew"
 *
 * @prop {String} character
 *
 * @cssprop --pokemon-card-header-bg - This sets the background color of the header
 *
 */

export class PokemonCardHTMLElement extends HTMLElement {
  static observedAttributes = ['character'];

  static cache: {
    [key: string]: any;
  } = {};

  private data: any = null;
  private loading = true;

  get character() {
    return this.getAttribute('character')!;
  }

  set character(value: string) {
    this.loading = true;
    this.render();
    this.setAttribute('character', value);
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.adoptedStyleSheets = [styles];

    this.render();
  }

  private fetchAndRender() {
    if (PokemonCardHTMLElement.cache[this.character]) {
      this.data = PokemonCardHTMLElement.cache[this.character];
      this.loading = false;
      this.render();
    } else {
      fetchPokemon(this.character).then((res) => {
        PokemonCardHTMLElement.cache[this.character] = res;
        this.data = res;
        this.loading = false;
        this.render();
      });
    }
  }

  attributeChangedCallback() {
    this.fetchAndRender();
  }

  private render() {
    const hp = this.data?.stats.find((stat: any) => stat.stat.name === 'hp');
    const stats = this.data?.stats.filter(
      (stat: any) => stat.stat.name !== 'hp'
    );
    this.shadowRoot!.innerHTML = html`
      <header>
        <h1>${this.loading ? `` : this.data?.name}</h1>
        <div>
          ${this.loading
            ? ``
            : html` <span class="hp-name">${hp.stat.name}</span>
                <span class="hp-value">${hp.base_stat}</span>`}
        </div>
      </header>
      <div class="card-content">
        ${this.loading
          ? html` <div class="loading-container">Loading...</div> `
          : ``}
        <div class="img-container">
          ${this.loading
            ? ``
            : html`<img
                src="${this.data?.sprites.other['official-artwork']
                  .front_default}"
              />`}
        </div>
        <ul class="stat-list">
          ${this.loading
            ? ``
            : stats
                ?.map((stat: any) =>
                  statListItem({
                    name: formatStatNames(stat.stat.name),
                    stat: stat.base_stat,
                  })
                )
                .join('')}
        </ul>
      </div>
    `;
  }
}

function statListItem({ name, stat }: any) {
  return html`
    <li class="stat-item">
      <span class="stat-name">${name}</span>
      <progress max="255" value="${stat}"></progress>
      <span class="stat-value">${stat}</span>
    </li>
  `;
}

function formatStatNames(name: string) {
  if (name.toLowerCase().startsWith('special')) {
    return `SP ${name.split('-')[1]}`;
  }
  return name;
}

customElements.define('pokemon-card', PokemonCardHTMLElement);
