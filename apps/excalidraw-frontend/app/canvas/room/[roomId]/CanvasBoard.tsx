import {Tool} from "@repo/common-types/tools"
import { useState,useRef,useEffect } from "react"
import {DrawElement,} from "@repo/common-types/canavs"
type Prop={
  tool:Tool
}

function CanvasBoard({tool}:Prop) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [drawing, setDrawing] = useState(false);

  console.log(tool);
  console.log(elements);

  
  const handleMouseDown = (e: React.MouseEvent) => {
 
    
  
    const rect = canvasRef.current!.getBoundingClientRect();
  
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (tool === "eraser" || tool === "select") return;

    if (tool === "text") {
      const value = prompt("Enter text");
      if (!value) return;
  
      const textElement: DrawElement = {
        type: "text",
        x1: x,
        y1: y,
        text: value,
        x2: 0,
        y2: 0
      };
  
      setElements(prev => [...prev, textElement]);
      return;
    }

    setDrawing(true);
    const newElement: DrawElement = {
      type: tool,
      x1: x,
      y1: y,
      x2: x,
      y2: y,
    };
  
    setElements((prev) => [...prev, newElement]);
  };

  function isHit(el: DrawElement, x: number, y: number) {
    const padding = 5;
    const minX = Math.min(el.x1, el.x2);
    const maxX = Math.max(el.x1, el.x2);
    const minY = Math.min(el.y1, el.y2);
    const maxY = Math.max(el.y1, el.y2);
  
    return  x >= minX - padding &&
    x <= maxX + padding &&
    y >= minY - padding &&
    y <= maxY + padding;
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    
  
    const rect = canvasRef.current!.getBoundingClientRect();
  
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    if (tool === "eraser") {
      setElements(prev =>
        prev.filter(el => !isHit(el, x, y))
      );
      return;
    }
  
    // stop if not drawing
    if (!drawing) return;

    setElements((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
    
      if (!last) return prev;
    
      last.x2 = x;
      last.y2 = y;
    
      return copy;
    });
  };

  const handleMouseUp = () => {
    setDrawing(false);
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

    elements.forEach((el) => {
      if (el.type === "rectangle") {
        ctx.strokeRect(
          el.x1,
          el.y1,
          el.x2 - el.x1,
          el.y2 - el.y1
        );
        ctx.lineWidth = 2;
      }

      if (el.type === "line") {
        ctx.beginPath();
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.stroke();
      }
      
      if (el.type === "pen") {
        ctx.beginPath();
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.stroke();
        
      }
      if (el.type === "text") {
        ctx.fillStyle = "white";
        ctx.font = "16px sans-serif";
        ctx.fillText(el.text || "", el.x1, el.y1);
      }
      
      
    });
  }, [elements]);


  return (
    <canvas
    ref={canvasRef}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    className="absolute top-0 left-0 w-full h-full text-white"
    />
  )
}

export default CanvasBoard
