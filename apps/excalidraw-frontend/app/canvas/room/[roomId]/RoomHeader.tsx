"use client";
import { Room, Member } from "@repo/common-types/roomtypes";
import { Button } from "@repo/ui/components/ui/button";
import { UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocketContext } from "@/providers/SocketProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ToolBar from "./ToolBar";
import CanvasBoard from "./CanvasBoard";
import {Tools,Tool} from "@repo/common-types/tools"



type ToolRoomProps = {
	room: Room;
};

const ToolRoom = ({ room }: ToolRoomProps) => {
	const [open, setOpen] = useState(false);
    const [tool,setTool]=useState<Tool>(Tools.Select)


	const router = useRouter();
	const { onlineUsers, lastMessage, send } = useSocketContext();

	useEffect(() => {
		if (!lastMessage) return;
		console.log("Got WS data in component:", lastMessage);

		if (lastMessage.type === "error") {
			toast.error(lastMessage.message);
		}

		if (lastMessage.type === "left room") {
			toast.success(`left room ${lastMessage.roomId}`);
			router.push(`/`);
		}
	}, [lastMessage, router]);

	const handleLeave = () => {
		send({
			type: "leave-room",
			roomId: room.slug,
		});
	};

	return (
        <>
            <div className="p-4 border-b flex justify-between items-center">
                {/* left  */}
                <div>
                    <h2 className="font-bold text-lg">{room.slug.toUpperCase()}</h2>
                    <p className="text-sm text-gray-500">
                        Admin: {room.admin.name}
                    </p>
                </div>

                {/* center */}
                <div>
                    <ToolBar tool={tool} setTool={setTool}/>
                </div>

                {/* right */}
                <div className="flex gap-4 ">
                    <div>
                        <Button
                            className="relative rounded-full px-3 text-accent bg-transparent border border-zinc-600 hover:bg-transparent hover:cursor-pointer"
                            onClick={() => setOpen((prev) => !prev)}
                        >
                            <UsersRound />
                        </Button>
                    </div>
                    <div>
                        <Button
                            className="hover:cursor-pointer"
                            onClick={handleLeave}
                        >
                            Leave Room
                        </Button>
                    </div>
                </div>

                {/* dropdown */}
                {open && (
                    <div className="absolute right-5 top-18 w-40 bg-zinc-900 border rounded-lg shadow-lg p-3 text-foreground">
                        <div className="space-y-2 ">
                            {room.members && room.members.length > 0 ? (
                                room.members.map((member: Member) => {
                                    const isOnline = onlineUsers.includes(
                                        member.id,
                                    );

                                    return (
                                        <div
                                            key={member.id}
                                            className="flex items-center space-x-2"
                                        >
                                            <div className="relative">
                                                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold">
                                                    {member.name?.[0]?.toUpperCase()}
                                                </div>

                                                {/* online indicator */}
                                                {isOnline ? (
                                                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-black" />
                                                ) : (
                                                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-gray-500 rounded-full border border-black" />
                                                )}
                                            </div>
                                            <span>{member.name}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <span className="text-xs text-gray-400 italic">
                                    No one joined yet
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="w-screen h-screen relative">
            <CanvasBoard tool={tool} />
            </div>
        </>
	);
};

export default ToolRoom;
