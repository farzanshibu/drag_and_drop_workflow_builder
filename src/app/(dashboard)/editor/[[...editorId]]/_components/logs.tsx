type Props = {};

export default function LogsContainer({}: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="w-full border-t border-b text-center p-1">Logs</div>
      <div className="flex-1 px-3 py-1 bg-black m-2 rounded-md">
        insert logs here
      </div>
      <div className=" text-start font-mono font-thin text-[10px] p-2">
        type HELP to see the commands
      </div>
    </div>
  );
}
