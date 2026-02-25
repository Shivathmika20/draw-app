export const Tools = {
    Select: "select",
    Rectangle: "rectangle",
    Pencil: "pencil",
    Line: "line",
    Text: "text"
  } as const;

export type Tool = (typeof Tools)[keyof typeof Tools];