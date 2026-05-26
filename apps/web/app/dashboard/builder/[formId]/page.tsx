import { BuilderCanvas } from "~/components/builder/builder-canvas";
import { BuilderFieldPanel } from "~/components/builder/builder-field-panel";

export default function BuilderEditorPage() {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1">
      <BuilderFieldPanel />
      <BuilderCanvas />
    </div>
  );
}
