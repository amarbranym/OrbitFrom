type AuthShellProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  footer?: React.ReactNode;
};

export function AuthShell({ children, title, description, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm ring-1 ring-foreground/5 sm:p-8">
          {children}
        </div>
        {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
      </main>
    </div>
  );
}
