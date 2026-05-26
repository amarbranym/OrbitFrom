import { InitFormRegistry } from "~/components/forms/init-form-registry";

export default function PublicFormLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InitFormRegistry />
      {children}
    </>
  );
}
