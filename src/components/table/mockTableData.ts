type Column = {
  id: keyof Row;
  label: string;
};

export type Row = {
  id: string;
  name: string;
  status: string;
  owner: string;
};

export const columns: Column[] = [
  { id: "name", label: "Name" },
  { id: "status", label: "Status" },
  { id: "owner", label: "Owner" },
];

export const rows: Row[] = Array.from({ length: 25 }, (_, i) => ({
  id: `row-${i}`,
  name: `Task ${i + 1}`,
  status: "In progress",
  owner: "Alex",
}));