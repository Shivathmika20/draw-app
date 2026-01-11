import { Infinity, Zap, Layers, DoorOpen, Palette, MousePointer } from "lucide-react"

const features = [
  {
    icon: DoorOpen,
    title: "Create or Join Rooms",
    description: "Start your own drawing room or join an existing one with a room code. Your personal canvas awaits.",
  },
  {
    icon: Infinity,
    title: "Infinite Canvas",
    description: "Never run out of space. Pan and zoom freely on an unlimited canvas for all your ideas.",
  },
  {
    icon: Palette,
    title: "Drawing Tools",
    description: "Shapes, arrows, text, freehand drawing, and more. Everything you need to visualize your thoughts.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for performance. Smooth drawing experience even with complex diagrams.",
  },
  {
    icon: Layers,
    title: "Hand-drawn Style",
    description: "Beautiful, hand-drawn look that makes your diagrams feel personal and approachable.",
  },
  {
    icon: MousePointer,
    title: "Easy to Use",
    description: "Intuitive interface with simple tools. No learning curve, just start drawing immediately.",
  },
]

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-18 ">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Everything you need to <span className="text-accent">sketch ideas</span>
        </h2>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          Simple yet powerful tools to visualize your thoughts in your own drawing room.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:bg-secondary/30"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
