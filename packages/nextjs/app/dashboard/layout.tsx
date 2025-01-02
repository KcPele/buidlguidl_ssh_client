export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-base-200">
      <div className="p-4 overflow-y-auto">{children}</div>
    </div>
  );
}
