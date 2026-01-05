import { useEffect, useState } from "react";

type TableCellProps = {
  value: string;
  onChange: (newValue: string) => void;
  onClick: () => void; // notify parent that this cell is active
  isActive?: boolean;  // active state from parent
};

export function TableCell({ value, onChange, onClick, isActive = false }: TableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => setLocalValue(value), [value]);

  const commit = () => {
    setIsEditing(false);
    if (localValue !== value) onChange(localValue);
  };

  const cancel = () => {
    setLocalValue(value);
    setIsEditing(false);
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
        onKeyDown={e => {
          if (e.key === "Enter") commit();
          else if (e.key === "Escape") cancel();
        }}
      />
    );
  }

  const handleClick = () => {
    if (!isActive) {
      // Cell not active, select it
      onClick();
    } else {
      // Cell is already active, enter edit mode
      setIsEditing(true);
    }
  };

  return (
    <div
      tabIndex={0}
      className={`
        w-full px-2 py-1 truncate cursor-text hover:bg-gray-50 
        ${isActive ? "border-2 border-blue-500 bg-blue-50" : "border"}
      `}
      onClick={handleClick}
    >
      {value}
    </div>
  );
}
