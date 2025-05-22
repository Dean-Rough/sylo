import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Sylo",
  description: "Dashboard for Sylo Design Studio Productivity App",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}