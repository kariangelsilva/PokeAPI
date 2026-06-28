export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  stats: PokemonStatSlot[];
  abilities: PokemonAbilitySlot[];
}

export interface PokemonSprites {
  front_default: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
    };
  };
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedResource;
}

export interface PokemonStatSlot {
  base_stat: number;
  effort: number;
  stat: NamedResource;
}

export interface PokemonAbilitySlot {
  is_hidden: boolean;
  slot: number;
  ability: NamedResource;
}

export interface NamedResource {
  name: string;
  url: string;
}
