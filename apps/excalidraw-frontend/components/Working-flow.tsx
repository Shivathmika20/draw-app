import { UserPlus, DoorOpen, PenTool } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up",
    description: "Create your free account in seconds with just your email and password.",
  },
  {
    icon: DoorOpen,
    step: "02",
    title: "Create or Join a Room",
    description: "Start a new drawing room or enter an existing room code to join.",
  },
  {
    icon: PenTool,
    step: "03",
    title: "Start Drawing",
    description: "Use the drawing tools to sketch diagrams, flowcharts, wireframes, and more.",
  },
]

export function Working() {
  return (
    <section id="how-it-works" className="container mx-auto px-4 py-10 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          How it <span className="text-accent">works</span>
        </h2>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">Get started in three simple steps</p>
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="relative text-center">
            {index < steps.length - 1 && (
              <div className="absolute left-1/2 top-12 hidden h-px w-full bg-gradient-to-r from-accent/50 to-transparent md:block" />
            )}
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
              <step.icon className="h-10 w-10 text-accent" />
              <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {step.step}
              </span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
