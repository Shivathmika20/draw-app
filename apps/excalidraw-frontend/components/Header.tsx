import Link from "next/link"
import { Button } from "@repo/ui/components/ui/button"
import { Pencil } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
            <Pencil className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Sketch</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            How it Works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="hidden text-muted-foreground hover:text-foreground hover:bg-secondary sm:inline-flex"
          >
           <Link href="/signin">Sign In</Link>
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/80">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
