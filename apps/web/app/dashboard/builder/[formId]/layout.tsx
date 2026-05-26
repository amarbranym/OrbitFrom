import { BuilderShell } from "~/components/builder/builder-shell";
import { InitFormRegistry } from "~/components/forms/init-form-registry";

type BuilderLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ formId: string }>;
};

export default async function BuilderLayout({ children, params }: BuilderLayoutProps) {
  const { formId } = await params;

  return (
    <BuilderShell formId={formId}>
      <InitFormRegistry />
      {children}
    </BuilderShell>
  );
}
