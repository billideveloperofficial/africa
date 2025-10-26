
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="container grid lg:grid-cols-5 gap-12 py-8">
        <aside className="hidden lg:block lg:col-span-1">
          <DashboardSidebar />
        </aside>
        <main className="lg:col-span-4">{children}</main>
      </div>
  );
}
