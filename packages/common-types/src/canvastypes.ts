export type ElementType =
  | "rectangle"
  | "pencil"
  | "line"
  | "text";

export interface DrawElement {
    id: string;
    type: ElementType;
  
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  
    points?: { x: number; y: number }[];
    text?: string;
  }