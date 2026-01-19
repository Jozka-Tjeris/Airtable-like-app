"use client";

import { api as trpc } from "~/trpc/react";
import { BaseIcon } from "./BaseIcon";

export function BaseList() {
  const { data: bases, isLoading } = trpc.base.listBases.useQuery();

  if (isLoading) return <div>Loading bases…</div>;
  if (!bases || bases.length === 0) return <div>No bases yet</div>;

  return (
    <div className="space-y-2">
      {bases.map((base, idx) => (
        <BaseIcon
          key={base.id}
          baseId={base.id}
          name={base.name}
          updatedAt={base.updatedAt}
          tabIndex={idx}
        />
      ))}
    </div>
  );
}
