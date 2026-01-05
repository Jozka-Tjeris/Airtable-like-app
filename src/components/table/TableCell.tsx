import { useEffect, useState } from "react";

type TableCellProps = {
  value: string;
  onChange: (newValue: string) => void;
  onMoveNext?: () => void;    // for Tab / arrow navigation
  onMovePrev?: () => void;    // optional for Shift+Tab
};

export function TableCell({ value, onChange, onMoveNext, onMovePrev }: TableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Keep local state in sync with external changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const commit = () => {
    setIsEditing(false);
    if (localValue !== value) {
      console.log("SV");
      onChange(localValue);
    }
  };

  const cancel = () => {
    setLocalValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commit();
      // Optionally move to next row/cell
      onMoveNext?.();
    } else if (e.key === "Escape") {
      cancel();
    } else if (e.key === "Tab") {
      commit();
      e.preventDefault(); // prevent default tab focus
      if (e.shiftKey) {
        onMovePrev?.();
      } else {
        onMoveNext?.();
      }
    }
  };

  if (isEditing) {
    return (
      <input
        autoFocus
        className="w-full px-2 py-1 border border-blue-400 outline-none"
        style={{ minWidth: 0 }}
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <div
      className="w-full px-2 py-1 truncate cursor-text hover:bg-gray-50"
      onDoubleClick={() => setIsEditing(true)}
    >
      {value}
    </div>
  );
}
