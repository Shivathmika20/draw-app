import {Tool} from "@repo/common-types/tools"
import { useState,useRef,useEffect } from "react"
import {DrawElement,} from "@repo/common-types/canavs"

type Prop={
  tool:Tool
}

type ExtendedDrawElement = DrawElement & {
  points?: { x: number; y: number }[]  // for pen
  dragging?: boolean
}


type TextBox = {
  id: number
  x: number
  y: number
  text: string
  editing: boolean
}

function CanvasBoard({tool}:Prop) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([])
  const [draggingText, setDraggingText] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null)

  console.log(tool);
  console.log(elements);

  
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
  
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (tool === "eraser" || tool === "select") return;

    if (tool === "text") {
      setTextBoxes(prev => prev.filter(tb => tb.text.trim() !== ""))
  
      const hit = textBoxes.find(tb =>
        x >= tb.x && x <= tb.x + 200 && y >= tb.y - 20 && y <= tb.y + 10
      )
      // Check if clicking on an existing text box
      // const hit = textBoxes.find(tb => {
      //   return x >= tb.x && x <= tb.x + 200 && y >= tb.y - 20 && y <= tb.y + 10
      // })
      if (hit) {
        setDraggingText({ id: hit.id, offsetX: x - hit.x, offsetY: y - hit.y })
        return
      }

       // Create new text box
       const newBox: TextBox = { id: Date.now(), x, y, text: "", editing: true }
       setTextBoxes(prev => [...prev, newBox])
       return

    }

    setDrawing(true);

    // ── Pen: start a new element with points array ──
    if (tool === "pen") {
      const newElement: ExtendedDrawElement = {
        type: "pen",
        x1: x, y1: y,
        x2: x, y2: y,
        points: [{ x, y }]
      }
      setElements(prev => [...prev, newElement])
      return
    }
    const newElement: ExtendedDrawElement = { type: tool, x1: x, y1: y, x2: x, y2: y }
    setElements(prev => [...prev, newElement])
  };

   function isHit(el: ExtendedDrawElement, x: number, y: number) {
    const padding = 5
    const minX = Math.min(el.x1, el.x2)
    const maxX = Math.max(el.x1, el.x2)
    const minY = Math.min(el.y1, el.y2)
    const maxY = Math.max(el.y1, el.y2)
    return x >= minX - padding && x <= maxX + padding && y >= minY - padding && y <= maxY + padding
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    
  
    const rect = canvasRef.current!.getBoundingClientRect();
  
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // ── Dragging a text box ──
    if (draggingText) {
      setTextBoxes(prev =>
        prev.map(tb =>
          tb.id === draggingText.id
            ? { ...tb, x: x - draggingText.offsetX, y: y - draggingText.offsetY }
            : tb
        )
      )
      return
    }
  
    if (tool === "eraser") {
      setElements(prev => prev.filter(el => !isHit(el, x, y)))
      
      // Also erase text boxes by checking proximity
      setTextBoxes(prev =>
        prev.filter(tb => {
          const inX = x >= tb.x && x <= tb.x + 200
          const inY = y >= tb.y - 24 && y <= tb.y + 60
          return !(inX && inY)
        })
      )
      return
    }
    
  
    // stop if not drawing
    if (!drawing) return;

    setElements((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
    
      if (!last) return prev;
    
      // ── Pen: push new point instead of replacing x2/y2 ──
      if (last.type === "pen" && last.points) {
        last.points = [...last.points, { x, y }]
        last.x2 = x
        last.y2 = y
      } else {
        last.x2 = x
        last.y2 = y
      }
    
      return copy;
    });
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setDraggingText(null)
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round"  // smooth joins

    elements.forEach((el) => {
      if (el.type === "rectangle") {
        ctx.strokeRect(
          el.x1,
          el.y1,
          el.x2 - el.x1,
          el.y2 - el.y1
        );
        
      }

      if (el.type === "line") {
        ctx.beginPath();
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.stroke();
      }

     
      // ── Pen: draw smooth curve through all points ──
      if (el.type === "pen" && el.points && el.points.length > 1) {
        ctx.beginPath()
        ctx.moveTo(el.points[0].x, el.points[0].y)

        for (let i = 1; i < el.points.length - 1; i++) {
          // midpoint smoothing → gives curvy result
          const midX = (el.points[i].x + el.points[i + 1].x) / 2
          const midY = (el.points[i].y + el.points[i + 1].y) / 2
          ctx.quadraticCurveTo(el.points[i].x, el.points[i].y, midX, midY)
        }
        // last point
        const last = el.points[el.points.length - 1]
        ctx.lineTo(last.x, last.y)
        ctx.stroke()
      }

      // if (el.type === "text") {
      //   ctx.fillStyle = "white";
      //   ctx.font = "16px sans-serif";
      //   ctx.fillText(el.text || "", el.x1, el.y1);
      // }
      
      
    });
  }, [elements]);


  return (
    <div>
      <canvas
    ref={canvasRef}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    className="absolute top-0 left-0 w-full h-full text-white"
    />

    {/* ── Draggable Text Boxes ── */}
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
          // click on textarea header to drag (handled via mousedown on canvas won't work here,
          // so we use onMouseDown on a drag handle div instead)
          style={{
            position: "absolute",
            left: tb.x,
            top: tb.y,
            background: "transparent",  // already there but check your global CSS
            color: "white",
            border: "1px dashed rgba(255,255,255,0.4)",
            outline: "none",
            resize: "both",
            fontSize: "16px",
            fontFamily: "sans-serif",
            minWidth: "120px",
            minHeight: "40px",
            padding: "4px",
            zIndex: 10,
            caretColor: "white",
            // ADD THIS — some browsers/Tailwind add bg color
            WebkitTextFillColor: "white",
          }}
          onMouseDown={e => {
            // allow drag from the textarea itself
            e.stopPropagation()
            const rect = canvasRef.current!.getBoundingClientRect()
            setDraggingText({
              id: tb.id,
              offsetX: e.clientX - rect.left - tb.x,
              offsetY: e.clientY - rect.top - tb.y,
            })
          }}
          onMouseUp={() => setDraggingText(null)}
        />
      ))}
    </div>


  )
}

export default CanvasBoard
