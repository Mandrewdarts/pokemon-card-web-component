import { LitElement } from 'lit';
export declare class PokemonCardHTMLElement extends LitElement {
    render(): import("lit-html").TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'pokemon-card': PokemonCardHTMLElement;
    }
}
