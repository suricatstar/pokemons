import styles from "../../styles/Pokemon.module.css";

import Image from "next/image";

export const getStaticPaths = async () => {
  const maxPokemons = 251;
  const api = `https://pokeapi.co/api/v2/pokemon/`;

  try {
    const res = await fetch(`${api}?limit=${maxPokemons}`);
    if (!res.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    const data = await res.json();
    const paths = data.results.map((pokemon, index) => ({
      params: { pokemonId: (index + 1).toString() }, // Corrigido para começar de 1
    }));

    return {
      paths,
      fallback: 'blocking', // Usar 'blocking' para gerar a página se não estiver pré-renderizada
    };
  } catch (error) {
    console.error(error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps = async (context) => {
  const id = context.params.pokemonId;

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!res.ok) {
      return {
        notFound: true,
      };
    }

    const data = await res.json();

    return {
      props: { pokemon: data },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

export default function Pokemon({ pokemon }) {
  if (!pokemon) {
    return <div>Pokémon não encontrado.</div>;
  }

  return (
    <div className={styles.pokemon_container}>
      <h1 className={styles.title}>{pokemon.name}</h1>
      <Image
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
        width="200"
        height="200"
        alt={pokemon.name}
      />
      <div>
        <h3>Número:</h3>
        <p>#{pokemon.id}</p>
      </div>
      <div>
        <h3>Tipo:</h3>
        <div className={styles.types_container}>
          {pokemon.types.map((item, index) => (
            <span
              key={index}
              className={`${styles.type} ${styles["type_" + item.type.name]}`}
            >
              {item.type.name}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.data_container}>
        <div className={styles.data_height}>
          <h4>Altura:</h4>
          <p>{pokemon.height * 10} cm</p>
        </div>
        <div className={styles.data_weight}>
          <h4>Peso:</h4>
          <p>{pokemon.weight / 10} kg</p>
        </div>
      </div>
    </div>
  );
}
