import ToolRoom from "../../../../components/RoomHeader";
import { GetRoomAction } from "@/actions/room-server-action";
import { notFound } from "next/navigation";
import { Room } from "@repo/common-types/roomtypes";

const Page = async ({ params }: { params: { roomId: string } }) => {
	const { roomId } = await params;

	const roomInfo = await GetRoomAction({ roomId });

	if (!roomInfo.success) {
		notFound();
	}

	const room: Room = roomInfo.message.room;

	return (
		<div>
			<ToolRoom room={room} />
		</div>
	);
};

export default Page;
