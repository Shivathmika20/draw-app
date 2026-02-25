import { DrawElement } from "./canvastypes.js";

export type ClientMessage =
  | { type: "join-room"; roomId: string }
  | { type: "leave-room"; roomId: string }
  | { type: "chat"; message: string; roomId: string }
  | { type: "draw"; element: DrawElement; roomId: string };

export type ServerMessage =
  | { type: "user-joined"; userId: string }
  | { type: "user-left"; userId: string }
  | { type: "chat"; message: string; userId: string }
  | { type: "draw"; element: DrawElement };