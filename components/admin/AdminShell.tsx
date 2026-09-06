import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut, Package, Ruler } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AdminShellProps {
  title: string;
  active: "catalogo" | "precios";
  externalHref: string;
  externalLabel: string;
  children: React.ReactNode;
}

/** Shared sticky header + section nav for every /admin/* page. */
export function AdminShell({ title, active, externalHref, externalLabel, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-nm-bg text-nm-text">
      <header className="sticky top-0 z-20 bg-nm-surface shadow-soft-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative hidden h-10 w-10 shrink-0 overflow-hidden rounded-full shadow-soft-inset-sm sm:block">
              <Image src="/logo.jpg" alt="Logo de La Barraca de Juan" fill sizes="40px" className="object-cover" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-heading text-xl text-nm-text">{title}</h1>
              <p className="text-xs text-nm-muted">La Barraca De Juan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={externalHref}
              target="_blank"
              className="nm-transition inline-flex h-10 items-center gap-2 rounded-pill bg-nm-surface px-3 text-sm text-nm-text shadow-soft-sm hover:shadow-soft"
            >
              <ExternalLink size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{externalLabel}</span>
            </Link>
            <a
              href="/api/admin/logout"
              className="nm-transition inline-flex h-10 items-center gap-2 rounded-pill bg-nm-surface px-3 text-sm text-nm-text shadow-soft-sm hover:shadow-soft"
            >
              <LogOut size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Salir</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
        <nav className="mb-6 inline-flex gap-1 rounded-pill p-1.5 shadow-soft-inset" aria-label="Administración">
          <AdminTabLink href="/admin/catalogo" active={active === "catalogo"} icon={<Package size={16} />}>
            Catálogo
          </AdminTabLink>
          <AdminTabLink href="/admin/precios" active={active === "precios"} icon={<Ruler size={16} />}>
            A medida
          </AdminTabLink>
        </nav>

        {children}
      </main>
    </div>
  );
}

function AdminTabLink({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "nm-transition inline-flex h-10 items-center gap-2 rounded-pill px-4 text-sm font-semibold",
        active ? "bg-nm-surface text-nm-accent shadow-soft-sm" : "text-nm-muted hover:text-nm-text",
      )}
    >
      {icon} {children}
    </Link>
  );
}
