export function BaseIcon({
  baseId,
  name,
  updatedAt,
  tabIndex,
}: {
  baseId: string;
  name: string;
  updatedAt: Date;
  tabIndex: number;
}) {
  return (
    <div
      className="flex relative rounded-md bg-white p-4 border border-gray-200"
      tabIndex={tabIndex}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#0d7f78] text-white">
        <span>{name[0] ?? "U"}</span>
      </div>

      <div className="flex flex-col ml-2 justify-center">
        <a href={`/base/${baseId}`}>
          <h3 className="font-normal">{name}</h3>
        </a>
        <div className="text-xs text-gray-500">
          Opened {Math.floor((Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60))} hours ago
        </div>
      </div>
    </div>
  );
}
