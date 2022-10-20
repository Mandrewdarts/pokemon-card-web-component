import { css } from './css';
import { fetchPokemon } from './pokemon-service';

const html = String.raw;

const styles = css`
  :host {
    --light: var(--pokemon-card-light, white);
    --dark: var(--pokemon-card-dark, #222);
    --light-grey: var(--pokemon-card-light-grey, #ddd);

    display: inline-block;
    width: 250px;
    height: calc(392px + 50px);
    border-radius: 0.5rem;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol';
    background-color: var(--dark);
    color: var(--light);
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }

  header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    padding: 1rem;
  }

  .hp-name {
    font-size: 0.5rem;
    text-transform: uppercase;
  }

  .hp-value {
    font-size: 1rem;
  }

  h1 {
    margin: 0;
    padding: 0;
    text-transform: capitalize;
    font-size: 1rem;
  }

  .card-content {
    background-color: var(--light);
    color: var(--dark);
    padding: 1rem;
  }

  .img-container {
    display: flex;
    justify-content: center;
    height: 200px;
  }

  img {
    width: 200px;
    height: 200px;
    height: auto;
  }

  .stats-header {
    font-size: 0.65rem;
    font-weight: bold;
    text-transform: uppercase;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li.stat-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    text-transform: uppercase;
    height: 2rem;
  }

  progress {
    border: none;
    height: 0.5rem;
  }

  progress::-webkit-progress-bar {
    background-color: var(--light-grey);
    border-radius: 9999px;
  }
  progress::-webkit-progress-value {
    border-radius: 9999px;
    background-color: var(--dark);
  }

  .stat-name {
    width: 100px;
  }

  .stat-value {
    margin-left: 1rem;
    font-weight: bold;
  }
`;

export class PokemonCardHTMLElement extends HTMLElement {
  static observedAttributes = ['character'];

  static cache: {
    [key: string]: any;
  } = {};

  data: any = null;
  loading = true;

  get character() {
    return this.getAttribute('character')!;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.adoptedStyleSheets = [styles];

    this.render();
  }

  fetchAndRender() {
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

  render() {
    if (this.loading) {
      this.shadowRoot!.innerHTML = 'Loading...';
    } else {
      const hp = this.data.stats.find((stat: any) => stat.stat.name === 'hp');
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
            ${this.data.stats
              .filter((stat: any) => stat.stat.name !== 'hp')
              .map((stat: any) => {
                return html`
                  <li class="stat-item">
                    <span class="stat-name"
                      >${formatStatNames(stat.stat.name)}</span
                    >
                    <progress max="100" value="${stat.base_stat}"></progress>
                    <span class="stat-value">${stat.base_stat}</span>
                  </li>
                `;
              })
              .join('')}
          </ul>
        </div>
      `;
    }
  }
}

function formatStatNames(name: string) {
  if (name.toLowerCase().startsWith('special')) {
    return `SP ${name.split('-')[1]}`;
  }
  return name;
}

customElements.define('pokemon-card', PokemonCardHTMLElement);
