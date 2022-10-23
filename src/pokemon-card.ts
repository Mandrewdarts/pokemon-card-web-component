import { css } from './css';
import { fetchPokemon } from './pokemon-service';
import sheet from './index.css' assert { type: 'css' };
const html = String.raw;

const styles = css(sheet);

export class PokemonCardHTMLElement extends HTMLElement {
  static observedAttributes = ['character'];

  static cache: {
    [key: string]: any;
  } = {};

  data: any = null;
  loading = true;

  getCharacter() {
    return this.getAttribute('character')!;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.adoptedStyleSheets = [styles];

    this.render();
  }

  fetchAndRender() {
    if (PokemonCardHTMLElement.cache[this.getCharacter()]) {
      this.data = PokemonCardHTMLElement.cache[this.getCharacter()];
      this.loading = false;
      this.render();
    } else {
      fetchPokemon(this.getCharacter()).then((res) => {
        PokemonCardHTMLElement.cache[this.getCharacter()] = res;
        this.data = res;
        this.loading = false;
        this.render();
      });
    }
  }

  attributeChangedCallback() {
    this.fetchAndRender();
  }

  render() {
    if (this.loading) {
      this.shadowRoot!.innerHTML = 'Loading...';
    } else {
      const hp = this.data.stats.find((stat: any) => stat.stat.name === 'hp');
      const stats = this.data.stats.filter(
        (stat: any) => stat.stat.name !== 'hp'
      );
      this.shadowRoot!.innerHTML = html`
        <header>
          <h1>${this.data?.name}</h1>
          <div>
            <span class="hp-name">${hp.stat.name}</span>
            <span class="hp-value">${hp.base_stat}</span>
          </div>
        </header>
        <div class="card-content">
          <div class="img-container">
            <img
              src="${this.data.sprites.other['official-artwork'].front_default}"
            />
          </div>
          <ul class="stat-list">
            ${stats
              .map((stat: any) =>
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
