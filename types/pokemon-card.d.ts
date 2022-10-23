export declare class PokemonCardHTMLElement extends HTMLElement {
    static observedAttributes: string[];
    static cache: {
        [key: string]: any;
    };
    data: any;
    loading: boolean;
    getCharacter(): string;
    connectedCallback(): void;
    fetchAndRender(): void;
    attributeChangedCallback(): void;
    render(): void;
}
