import { Tools, Tool } from "@repo/common-types";
import { Button } from "@repo/ui/components/ui/button";
import {
	MousePointer,
	Square,
	Pencil,
	Slash,
	Type,
	Eraser,
} from "lucide-react";

type Props = {
	tool: Tool;
	setTool: (tool: Tool) => void;
};

type Items = {
	tool: Tool;
	icon: React.ReactNode;
	label: string;
};

const toolItems: Items[] = [
	{
		tool: Tools.Select,
		icon: <MousePointer />,
		label: "Select",
	},
	{
		tool: Tools.Rectangle,
		icon: <Square />,
		label: "Rectangle",
	},
	{
		tool: Tools.Pen,
		icon: <Pencil />,
		label: "Pen",
	},
	{
		tool: Tools.Line,
		icon: <Slash />,
		label: "Line",
	},
	{
		tool: Tools.Text,
		icon: <Type size={4} />,
		label: "Text",
	},
	{
		tool: Tools.Eraser,
		icon: <Eraser size={4} />,
		label: "Eraser",
	},
];

function ToolBar({ tool, setTool }: Props) {
	return (
		<div className="flex space-x-2 border border-zinc-600 rounded-xl w-xl items-center justify-center py-2">
			{toolItems.map((item) => (
				<Button
					key={item.tool}
					onClick={() => setTool(item.tool)}
					title={item.label} //tooltip
					className={`text-white bg-transparent hover:bg-accent/20 transition-colors p-1.5 h-8 w-8
          ${tool === item.tool ? "bg-accent/50 hover:bg-accent/50 hover: border hover:border-accent/60 hover:cursor-pointer" : ""}`}
				>
					{item.icon}
				</Button>
			))}
		</div>
	);
}

export default ToolBar;
