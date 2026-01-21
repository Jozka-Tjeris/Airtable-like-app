"use client";

import { useState } from "react";
import { useBaseMutations } from "~/components/base/useBaseMutations";

export function Sidebar() {
  const [creating, setCreating] = useState(false);
  const { handleCreateBase } = useBaseMutations();

  return (
    <aside className="flex h-full w-75 flex-col gap-2 border-r p-4">
      <div className="min-h-145">
        {/* <!-- Home link --> */}
        <a
          href=""
          className="text-decoration-none mb-[4px] flex items-center rounded bg-gray-100 px-[6px] py-[6px] hover:bg-gray-200"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            className="icon flex-none"
          >
            <use
              fill="currentColor"
              href="/assets/icon_definitions.svg#House"
            ></use>
          </svg>
          <h4 className="ml-[6px] truncate text-[16px] leading-[24px] font-semibold text-gray-900">
            Home
          </h4>
        </a>

        {/* <!-- Starred --> */}
        <div className="mb-[4px] flex items-center justify-between rounded hover:bg-gray-100">
          <a href="" className="flex w-full items-center px-[6px] py-[6px]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 16"
              className="icon flex-none"
            >
              <use
                fill="currentColor"
                href="/assets/icon_definitions.svg#Star"
              ></use>
            </svg>
            <div className="ml-[6px] truncate">Starred</div>
          </a>
          <button className="flex rounded p-[4px] hover:bg-gray-200 focus:outline-none">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className="animate flex-none text-gray-700"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "center",
                transformBox: "fill-box",
                flexShrink: 0,
              }}
            >
              <use
                fill="currentColor"
                href="/assets/icon_definitions.svg#ChevronDown"
              ></use>
            </svg>
          </button>
        </div>

        {/* <!-- Shared --> */}
        <a
          href=""
          className="mb-[4px] flex items-center rounded px-[6px] py-[6px] hover:bg-gray-100"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            className="icon flex-none"
          >
            <use
              fill="currentColor"
              href="/assets/icon_definitions.svg#Share"
            ></use>
          </svg>
          <h4 className="ml-[6px] truncate text-[16px] leading-[24px] text-gray-900">
            Shared
          </h4>
        </a>

        {/* <!-- Workspaces --> */}
        <div className="mb-[8px] flex items-center justify-between rounded hover:bg-gray-100">
          <a
            href=""
            className="flex w-full items-center justify-between px-[6px] py-[6px]"
          >
            <div className="flex items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                className="mr-[4px] flex-none"
              >
                <use
                  fill="currentColor"
                  href="/assets/icon_definitions.svg#UsersThree"
                ></use>
              </svg>
              Workspaces
            </div>
            <button className="flex rounded p-[4px] hover:bg-gray-200">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className="flex-none text-gray-700"
              >
                <use
                  fill="currentColor"
                  href="/assets/icon_definitions.svg#Plus"
                ></use>
              </svg>
            </button>
          </a>
          <div
            tabIndex={0}
            role="button"
            className="flex rounded p-[4px] hover:bg-gray-200"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className="animate text-color-default flex-none"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "center",
                transformBox: "fill-box",
                flexShrink: 0,
              }}
            >
              <use
                fill="currentColor"
                href="/assets/icon_definitions.svg#ChevronDown"
              ></use>
            </svg>
          </div>
        </div>
      </div>

      <div className="my-1 border-t"></div>

      <div>
        <a
          href=""
          className="mb-[4px] flex h-[32px] w-full items-center rounded px-[6px] hover:bg-gray-100"
        >
          <svg width="16" height="16" className="mr-[4px] flex-none">
            <use
              fill="currentColor"
              href="/assets/icon_definitions.svg#BookOpen"
            ></use>
          </svg>
          Templates and apps
        </a>
        <a
          href="https://airtable.com/marketplace"
          className="mb-[4px] flex h-[32px] w-full items-center rounded px-[6px] hover:bg-gray-100"
        >
          <svg width="16" height="16" className="mr-[4px] flex-none">
            <use
              fill="currentColor"
              href="/assets/icon_definitions.svg#ShoppingBagOpen"
            ></use>
          </svg>
          Marketplace
        </a>
        <a
          href=""
          className="mb-[4px] flex h-[32px] w-full items-center rounded px-[6px] hover:bg-gray-100"
        >
          <svg width="16" height="16" className="mr-[4px] flex-none">
            <use
              fill="currentColor"
              href="/assets/icon_definitions.svg#UploadSimple"
            ></use>
          </svg>
          Import
        </a>
        <div>
          <button
            onClick={async () => {
              setCreating(true);
              try {
                await handleCreateBase("Untitled Base"); // handleCreateBase should return mutateAsync
              } catch (err) {
                alert("Failed to create base");
                console.error(err);
              } finally {
                setCreating(false);
              }
            }}
            disabled={creating}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <svg width="16" height="16" className="flex-none">
              <use
                fill="currentColor"
                href="/assets/icon_definitions.svg#Plus"
              />
            </svg>
            {creating ? "Creating…" : "Create Base"}
          </button>
        </div>
      </div>
    </aside>
  );
}
