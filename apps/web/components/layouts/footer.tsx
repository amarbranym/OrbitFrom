import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-linear-to-b from-primary/[0.03] to-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} OrbitForm · Build forms that convert
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link href="/explore" className="text-muted-foreground transition-colors hover:text-primary">
            Explore
          </Link>
          <Link href="/pricing" className="text-muted-foreground transition-colors hover:text-primary">
            Pricing
          </Link>
          <Link href="/docs" className="text-muted-foreground transition-colors hover:text-primary">
            API docs
          </Link>
        </nav>
      </div>
    </footer>
  );
}
