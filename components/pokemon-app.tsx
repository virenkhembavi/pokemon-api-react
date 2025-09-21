"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface Pokemon {
  id: number
  name: string
  url: string
}

interface PokemonDetails {
  id: number
  name: string
  height: number
  weight: number
  abilities: Array<{
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
  }>
  types: Array<{
    type: {
      name: string
    }
  }>
  sprites: {
    front_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
}

export default function PokemonApp() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
  const [selectedPokemon, setSelectedPokemon] = useState<string>("")
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [cache, setCache] = useState<Map<string, PokemonDetails>>(new Map())

  // Fetch initial Pokemon list
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        const data = await response.json()
        setPokemonList(data.results)
      } catch (error) {
        console.error("Error fetching Pokemon list:", error)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchPokemonList()
  }, [])

  // Fetch Pokemon details
  const fetchPokemonDetails = async (pokemonName: string) => {
    // Check cache first
    if (cache.has(pokemonName)) {
      setPokemonDetails(cache.get(pokemonName)!)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      const data = await response.json()

      // Cache the result
      setCache((prev) => new Map(prev).set(pokemonName, data))
      setPokemonDetails(data)
    } catch (error) {
      console.error("Error fetching Pokemon details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePokemonSelect = (pokemonName: string) => {
    setSelectedPokemon(pokemonName)
    fetchPokemonDetails(pokemonName)
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: "bg-gray-400",
      fire: "bg-red-500",
      water: "bg-blue-500",
      electric: "bg-yellow-400",
      grass: "bg-green-500",
      ice: "bg-blue-200",
      fighting: "bg-red-700",
      poison: "bg-purple-500",
      ground: "bg-yellow-600",
      flying: "bg-indigo-400",
      psychic: "bg-pink-500",
      bug: "bg-green-400",
      rock: "bg-yellow-800",
      ghost: "bg-purple-700",
      dragon: "bg-indigo-700",
      dark: "bg-gray-800",
      steel: "bg-gray-500",
      fairy: "bg-pink-300",
    }
    return colors[type] || "bg-gray-400"
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading Pokémon...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Pokemon Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Select a Pokémon</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedPokemon} onValueChange={handlePokemonSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a Pokémon to explore..." />
            </SelectTrigger>
            <SelectContent>
              {pokemonList.map((pokemon) => (
                <SelectItem key={pokemon.name} value={pokemon.name}>
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Pokemon Details */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading Pokémon details...</span>
          </CardContent>
        </Card>
      )}

      {pokemonDetails && !loading && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                {pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1)}
                <span className="text-sm text-muted-foreground">#{pokemonDetails.id}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={
                    pokemonDetails.sprites.other["official-artwork"].front_default ||
                    pokemonDetails.sprites.front_default
                  }
                  alt={pokemonDetails.name}
                  className="w-48 h-48 object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-card-foreground">Height:</span>
                  <p className="text-muted-foreground">{pokemonDetails.height / 10} m</p>
                </div>
                <div>
                  <span className="font-semibold text-card-foreground">Weight:</span>
                  <p className="text-muted-foreground">{pokemonDetails.weight / 10} kg</p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-card-foreground">Types:</span>
                <div className="flex gap-2 mt-1">
                  {pokemonDetails.types.map((type) => (
                    <Badge key={type.type.name} className={`${getTypeColor(type.type.name)} text-white`}>
                      {type.type.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Abilities and Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Abilities & Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-semibold text-card-foreground">Abilities:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {pokemonDetails.abilities.map((ability, index) => (
                    <Badge
                      key={index}
                      variant={ability.is_hidden ? "secondary" : "outline"}
                      className={ability.is_hidden ? "bg-accent text-accent-foreground" : ""}
                    >
                      {ability.ability.name.replace("-", " ")}
                      {ability.is_hidden && " (Hidden)"}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-card-foreground">Base Stats:</span>
                <div className="space-y-2 mt-2">
                  {pokemonDetails.stats.map((stat) => (
                    <div key={stat.stat.name} className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground w-20 capitalize">
                        {stat.stat.name.replace("-", " ")}:
                      </span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-card-foreground w-8">{stat.base_stat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {cache.size > 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              💾 Cached {cache.size} Pokémon for faster loading
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
