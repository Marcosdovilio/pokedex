import { useEffect, useState } from "react";
import { ScrollView, Text, View, Image } from "react-native";

type Pokemons = {
  name: string;
  image: string;
  imageBack: string;
  height: number;
  weight: number;
  type: string;
};

export default function Index() {
  const [pokemon, setPokemon] = useState<Pokemons[]>([]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=20",
      );
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            height: details.height,
            weight: details.weight,
            type: details.types[0].type.name,
          };
        }),
      );

      setPokemon(detailedPokemons);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      {pokemon.map((poke) => (
        <View style={{ backgroundColor: "#e4e4e4", margin: 10, padding: 20 }}>
          <View
            key={poke.name}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>{poke.name}</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Image
                source={{ uri: poke.image }}
                style={{ width: 100, height: 100 }}
              />
              <Image
                source={{ uri: poke.imageBack }}
                style={{ width: 100, height: 100 }}
              />
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text>Height: {poke.height} </Text>
              <Text>Weight: {poke.weight}</Text>
            </View>
            <Text>Type: {poke.type} </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
