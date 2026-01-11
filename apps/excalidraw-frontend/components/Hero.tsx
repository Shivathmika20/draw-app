import { Button } from "@repo/ui/components/ui/button"
import { ArrowRight, Plus, LogIn } from "lucide-react"

export function Hero() {
  return (
    <section className="container mx-auto px-4 pt-20 mb-8 text-center md:pt-18 ">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
          </span>
          Create or join drawing rooms
          <ArrowRight className="h-3 w-3" />
        </div>

        <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl">
          Sketch your
          <br />
          <span className="text-accent">ideas</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          A simple whiteboard app for sketching hand-drawn diagrams. Create your own room or join an existing one to
          start drawing.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-12 rounded-full bg-accent px-8 text-accent-foreground hover:bg-accent/80 shadow-lg shadow-accent/25"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Room
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full px-8 border-border bg-secondary/50 text-foreground hover:bg-secondary hover:border-accent/50"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Join Room
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">Sign up to create and save your drawing rooms.</p>
      </div>
    </section>
  )
}
