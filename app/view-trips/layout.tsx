import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "View Trips - Income Manager",
  description: "Browse, search and filter all recorded trips",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <main>{children}</main>
    </div>
  );
}
