import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trahbiz Admin",
  description: "Content Management System",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
