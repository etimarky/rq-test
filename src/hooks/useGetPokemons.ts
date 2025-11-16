import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export interface Pokemon {
  id: string;
  name: string;
  types?: string[];
  sprite?: string;
}

interface PokemonType {
  type: {
    typenames?: [
      { name: string }
    ]
  }
}

export interface PokemonDetail extends Pokemon {
  weight: string
  height: string
  captureRate: string
}

export const GET_POKEMONS = gql`
  query GetPokemons($search: String) {
    pokemon(
      limit: 151
      order_by: { id: asc }
      where: {
        pokemonspecy: {
          pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _regex: $search } }
        }
      }
    ) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
    }
  }
`;

export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: Int!) {
    pokemon(where: { id: { _eq: $id } }) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
        capture_rate
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
      weight
      height
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
    }
  }
`;

// Search should be done client-side for the mid-level assessment. Uncomment for the senior assessment.
export const useGetPokemons = (/* search?: string */): {
  data: Pokemon[];
  loading: boolean;
  error: useQuery.Result['error'];
} => {
  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMONS, {
    variables: {
      search: '', // `.*${search}.*`,
    },
  });

  return {
    data:
      data?.pokemon?.map(
        (p): Pokemon => ({
          id: p.id,
          name: p.pokemonspecy.pokemonspeciesnames?.[0]?.name,
          types: p.pokemontypes?.[0]?.type?.typenames?.[0]?.name,
          sprite: p.pokemonsprites?.[0]?.sprites
        }),
      ) ?? [],
    loading,
    error,
  };
};

export const useGetPokemonDetail = (id: string): {
  data: PokemonDetail | null;
  loading: boolean;
  error: any;
} => {
  const { data, loading, error } = useQuery<{ pokemon: any[] }>(GET_POKEMON_DETAILS, {
    variables: { id: id },
    skip: !id
  });

  if (!data?.pokemon?.length) return { data: null, loading, error };

  const p = data.pokemon[0];

  const mapped: PokemonDetail = {
    id: p.id,
    name: p.pokemonspecy.pokemonspeciesnames?.[0]?.name,
    types: p.pokemontypes?.map((t: PokemonType) => t.type.typenames?.[0]?.name) ?? [],
    sprite: p.pokemonsprites?.[0]?.sprites,
    weight: p.weight,
    height: p.height,
    captureRate: p.pokemonspecy.capture_rate,
  };

  return { data: mapped, loading, error };
};