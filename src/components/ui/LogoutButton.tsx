"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })} // async call inside click handler
      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
    >
      Log out
    </button>
  );
}
