import { Room ,Member} from '@repo/common-types/roomtypes'

type ToolBarProps = {
  room: Room;
};

const ToolBar = ({ room }: ToolBarProps) => {
  return (
    <div className="p-4 border-b flex justify-between">

    <div>
      <h2 className="font-bold text-lg">{room.slug}</h2>
      <p className="text-sm text-gray-500">
        Admin: {room.admin.name}
      </p>
    </div>

    <div className="flex gap-2">
      {room.members && room.members.length >0 ? (
        room.members.map((member:Member)=>(
          <div key={member.id} className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-semibold">
            {member.name?.[0]?.toUpperCase()}
          </div>
        ))
      ):(
        <span className="text-xs text-gray-400 italic">
        No one joined yet
      </span>
      )}
    </div>

  </div>
  )
}

export default ToolBar
