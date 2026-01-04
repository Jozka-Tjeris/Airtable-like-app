export function TableCell({ value }: {value: string}) {
  return (
    <div className="w-48 px-2 py-1 border-r truncate">
      {value}
    </div>
  );
}