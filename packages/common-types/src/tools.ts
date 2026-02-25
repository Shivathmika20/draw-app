export const Tools = {
    Select: "select",
    Rectangle: "rectangle",
    Pen: "pen",
    Line: "line",
    Text: "text",
    Eraser:"eraser"
  } as const;

export type Tool = (typeof Tools)[keyof typeof Tools];