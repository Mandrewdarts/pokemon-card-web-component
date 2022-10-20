export function fetchPokemon(name: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((res) =>
        resolve(res.json())
      );
    }, 2000);
  });
}
