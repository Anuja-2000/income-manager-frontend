import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Trip - Income Manager",
  description: "Add a new trip to the income manager",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    
  return (
    <div className="layout">
      <main>{children}</main>
    </div>
  );
}