import PokemonApp from "@/components/pokemon-app"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Pokédex Explorer</h1>
          <p className="text-muted-foreground text-lg">Discover and explore Pokémon from the PokeAPI</p>
        </header>
        <PokemonApp />
      </div>
    </main>
  )
}
