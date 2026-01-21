import { useBaseMutations } from "~/components/base/useBaseMutations";

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
  const { handleRenameBase, handleDeleteBase } = useBaseMutations();
  return (
    <div
      className="relative flex rounded-md border border-gray-200 bg-white p-4"
      tabIndex={tabIndex}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0d7f78] text-white">
        <span>{name.slice(0, 2) ?? "U"}</span>
      </div>

      <div className="ml-2 flex w-[75%] flex-col justify-center">
        <div className="flex flex-row">
          <a className="flex flex-1" href={`/base/${baseId}`}>
            <h3 className="font-normal">{name}</h3>
          </a>
          <button
            className="w-6 cursor-pointer px-4"
            onClick={() => {
              const newName = prompt("Set new name for base:");
              if (newName === null) return;
              if (newName.trim() === "") {
                alert("Base name cannot be empty");
                return;
              }
              handleRenameBase(baseId, newName.trim());
            }}
          >
            ✏️
          </button>
          <button
            className="w-6 cursor-pointer px-4"
            onClick={() => {
              if (window.confirm(`Delete base?`)) handleDeleteBase(baseId);
            }}
          >
            🗑️
          </button>
        </div>
        <div className="text-xs text-gray-500">
          <span>
            Opened{" "}
            {Math.floor(
              (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60),
            )}{" "}
            hours ago
          </span>
        </div>
      </div>
    </div>
  );
}
