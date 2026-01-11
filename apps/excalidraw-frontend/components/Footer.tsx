import Link from "next/link"
import { Pencil} from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Pencil className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Sketch</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Sketch. All rights reserved.
            </div>
            
          </nav>

          
        </div>

        
      </div>
    </footer>
  )
}
