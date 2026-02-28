"use client";

import { usePathname } from "next/navigation";

interface ConditionalLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export function ConditionalLayout({ header, children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAuthPage || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
    </>
  );
}
