import { TopBar } from "./TopBar";
import { Sidebar } from "./SideBar";
import { BaseList } from "./BaseList";

function MainDashboardContent() {
  return (
    <main className="flex-1 overflow-auto bg-[#f9fafb] p-8">
      <h1 className="mb-4 text-[27px] font-semibold">Home</h1>
      <h3 className="mb-4 text-sm">Opened Anytime</h3>
      <div className="grid grid-cols-2 gap-4">
        <BaseList />
      </div>
    </main>
  );
}

export function DashboardShell() {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <div className="flex flex-1 flex-row">
        <Sidebar />
        <MainDashboardContent />
      </div>
    </div>
  );
}
