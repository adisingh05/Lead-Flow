import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import OrganizationProvider from "@/providers/OrganizationProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrganizationProvider>
      <div className="flex h-screen bg-[#FAFAF9] overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </OrganizationProvider>
  );
}
