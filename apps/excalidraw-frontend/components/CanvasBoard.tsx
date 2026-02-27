import {Tool} from "@repo/common-types/tools"
import { useState,useRef,useEffect, useCallback } from "react"
import {DrawElement,} from "@repo/common-types/canavs"

type Prop={
  tool:Tool
}

type ExtendedDrawElement = DrawElement & {
  id:string
  points?: { x: number; y: number }[]  // for pen
  dragging?: boolean
}


type TextBox = {
  id: string
  x: number
  y: number
  text: string
  editing: boolean
}

type Snapshot = {
  elements: ExtendedDrawElement[]
  textBoxes: TextBox[]
}

const uid = () => Math.random().toString(36).slice(2, 9)

function CanvasBoard({tool}:Prop) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([])
  const [draggingText, setDraggingText] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null)
  const [selectedId,   setSelectedId]   = useState<string | null>(null)
  const [movingShape,  setMovingShape]  = useState<{
    id: string
    offsetX: number
    offsetY: number
    origX1: number
    origY1: number
    origX2: number
    origY2: number
    origPoints?: { x: number; y: number }[]
  } | null>(null)
  const undoStack = useRef<Snapshot[]>([])
  const redoStack = useRef<Snapshot[]>([])


  const saveSnapshot = useCallback(() => {
    undoStack.current.push({
      elements:  elements.map(e => ({ ...e, points: e.points ? [...e.points] : undefined })),
      textBoxes: textBoxes.map(t => ({ ...t })),
    })
    redoStack.current = []          // new action clears redo
  }, [elements, textBoxes])

  const undo = useCallback(() => {
    const prev = undoStack.current.pop()
    if (!prev) return
    redoStack.current.push({
      elements:  elements.map(e => ({ ...e })),
      textBoxes: textBoxes.map(t => ({ ...t })),
    })
    setElements(prev.elements)
    setTextBoxes(prev.textBoxes)
    setSelectedId(null)
  }, [elements, textBoxes])

  const redo = useCallback(() => {
    const next = redoStack.current.pop()
    if (!next) return
    undoStack.current.push({
      elements:  elements.map(e => ({ ...e })),
      textBoxes: textBoxes.map(t => ({ ...t })),
    })
    setElements(next.elements)
    setTextBoxes(next.textBoxes)
    setSelectedId(null)
  }, [elements, textBoxes])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); redo() }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [undo, redo])


  function isHit(el: ExtendedDrawElement, x: number, y: number) {
    const padding = 5
    const minX = Math.min(el.x1, el.x2)
    const maxX = Math.max(el.x1, el.x2)
    const minY = Math.min(el.y1, el.y2)
    const maxY = Math.max(el.y1, el.y2)
    return x >= minX - padding && x <= maxX + padding && y >= minY - padding && y <= maxY + padding
  }
  
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
  
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === "select") {
      const hit = [...elements].reverse().find(el => isHit(el, x, y))
      if (hit) {
        saveSnapshot()                  // save before move so we can undo it
        setSelectedId(hit.id)
        setMovingShape({
          id:         hit.id,
          offsetX:    x,
          offsetY:    y,
          origX1:     hit.x1,
          origY1:     hit.y1,
          origX2:     hit.x2,
          origY2:     hit.y2,
          origPoints: hit.points ? hit.points.map(p => ({ ...p })) : undefined,
        })
      } else {
        setSelectedId(null)
      }
      return
    }
    if (tool === "eraser" ) return;

    if (tool === "text") {
      setTextBoxes(prev => prev.filter(tb => tb.text.trim() !== ""))

      const hit = textBoxes.find(tb =>
        x >= tb.x && x <= tb.x + 200 && y >= tb.y - 20 && y <= tb.y + 40
      )
      if (hit) {
        setDraggingText({ id: hit.id, offsetX: x - hit.x, offsetY: y - hit.y })
        return
      }

      saveSnapshot()
      const newBox: TextBox = { id: uid(), x, y, text: "", editing: true }
      setTextBoxes(prev => [...prev, newBox])
      return
    }
    saveSnapshot()
    setDrawing(true);

   
    if (tool === "pen") {
      const newElement: ExtendedDrawElement = {
        id: uid(),
        type: "pen",
        x1: x, y1: y,
        x2: x, y2: y,
        points: [{ x, y }]
      }
      setElements(prev => [...prev, newElement])
      return
    }
    const newEl: ExtendedDrawElement = { id: uid(), type: tool, x1: x, y1: y, x2: x, y2: y }
    setElements(prev => [...prev, newEl])
  };

   

  const handleMouseMove = (e: React.MouseEvent) => {
    
  
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Moving a selected shape
    if (movingShape) {
      const dx = x - movingShape.offsetX
      const dy = y - movingShape.offsetY
      setElements(prev => prev.map(el => {
        if (el.id !== movingShape.id) return el
        return {
          ...el,
          x1: movingShape.origX1 + dx,
          y1: movingShape.origY1 + dy,
          x2: movingShape.origX2 + dx,
          y2: movingShape.origY2 + dy,
          points: movingShape.origPoints?.map(p => ({ x: p.x + dx, y: p.y + dy }))
        }
      }))
      return
    }

    // Dragging a text box
    if (draggingText) {
      setTextBoxes(prev => prev.map(tb =>
        tb.id === draggingText.id
          ? { ...tb, x: x - draggingText.offsetX, y: y - draggingText.offsetY }
          : tb
      ))
      return
    }

    // Eraser
    if (tool === "eraser") {
      const willErase     = elements.some(el => isHit(el, x, y))
      const willEraseText = textBoxes.some(tb =>
        x >= tb.x && x <= tb.x + 200 && y >= tb.y - 24 && y <= tb.y + 60
      )
      if (willErase || willEraseText) saveSnapshot()

      setElements(prev => prev.filter(el => !isHit(el, x, y)))
      setTextBoxes(prev => prev.filter(tb => {
        const inX = x >= tb.x && x <= tb.x + 200
        const inY = y >= tb.y - 24 && y <= tb.y + 60
        return !(inX && inY)
      }))
      return
    }

    if (!drawing) return

    // Update the shape currently being drawn
    setElements(prev => {
      const copy = [...prev]
      const last = copy[copy.length - 1]
      if (!last) return prev

      if (last.type === "pen" && last.points) {
        last.points = [...last.points, { x, y }]
        last.x2 = x
        last.y2 = y
      } else {
        last.x2 = x
        last.y2 = y
      }

      return copy
    })
    
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setDraggingText(null)
    setMovingShape(null)
  };


//canvas drawing

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineCap  = "round"
    ctx.lineJoin = "round"

    elements.forEach(el => {
      const selected = el.id === selectedId

      // blue dashed selection box
      if (selected) {
        ctx.save()
        ctx.strokeStyle = "#60a5fa"
        ctx.lineWidth   = 2
        ctx.setLineDash([6, 3])
        const pad  = 8
        const minX = Math.min(el.x1, el.x2) - pad
        const minY = Math.min(el.y1, el.y2) - pad
        const w    = Math.abs(el.x2 - el.x1) + pad * 2
        const h    = Math.abs(el.y2 - el.y1) + pad * 2
        ctx.strokeRect(minX, minY, w, h)
        ctx.restore()
      }

      ctx.strokeStyle = selected ? "#60a5fa" : "white"
      ctx.lineWidth   = 2
      ctx.setLineDash([])

      if (el.type === "rectangle") {
        ctx.strokeRect(el.x1, el.y1, el.x2 - el.x1, el.y2 - el.y1)
      }

      if (el.type === "line") {
        ctx.beginPath()
        ctx.moveTo(el.x1, el.y1)
        ctx.lineTo(el.x2, el.y2)
        ctx.stroke()
      }

      if (el.type === "pen" && el.points && el.points.length > 1) {
        ctx.beginPath()
        ctx.moveTo(el.points[0].x, el.points[0].y)
        for (let i = 1; i < el.points.length - 1; i++) {
          const midX = (el.points[i].x + el.points[i + 1].x) / 2
          const midY = (el.points[i].y + el.points[i + 1].y) / 2
          ctx.quadraticCurveTo(el.points[i].x, el.points[i].y, midX, midY)
        }
        const last = el.points[el.points.length - 1]
        ctx.lineTo(last.x, last.y)
        ctx.stroke()
      }
    })
  }, [elements,selectedId]);


  const cursor =
    tool === "eraser" ? "cell" :
    tool === "select" ? (movingShape ? "grabbing" : "default") :
    "crosshair"

  return (
    <div className="relative w-full h-full">

      {/* cursor is dynamic so style prop needed here */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="absolute top-0 left-0 w-full h-full"
        style={{ cursor }}
      />

      

      {/* Draggable Text Boxes */}
      
      {textBoxes.map(tb => (
        <textarea
          key={tb.id}
          autoFocus={tb.editing}
          value={tb.text}
          onChange={e =>
            setTextBoxes(prev =>
              prev.map(t => t.id === tb.id ? { ...t, text: e.target.value } : t)
            )
          }
          className="absolute bg-transparent text-white border border-dashed border-transparent outline-none resize font-sans text-base min-w-[120px] min-h-[40px] p-1 z-10 caret-white hover:border-white/30 focus:border-white/50 transition-colors"
          style={{ left: tb.x, top: tb.y }}
          onMouseDown={e => {
            e.stopPropagation()
            const rect = canvasRef.current!.getBoundingClientRect()
            setDraggingText({
              id:      tb.id,
              offsetX: e.clientX - rect.left - tb.x,
              offsetY: e.clientY - rect.top  - tb.y,
            })
          }}
          onMouseUp={() => setDraggingText(null)}
        />
      ))}

    </div>
  )
}


export default CanvasBoard
