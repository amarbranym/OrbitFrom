"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { ShareFormDialog } from "~/components/builder/share-form-dialog";
import { useBuilderNavigation } from "~/components/builder/builder-unsaved-guard";
import { useBuilderForm, useBuilderQuery } from "~/components/builder/builder-form-context";
import {
  builderNavItems,
  getActiveBuilderSegment,
  builderHref,
} from "~/config/builder-nav";
import { cn } from "~/lib/utils";

export function BuilderNavSidebar() {
  const pathname = usePathname();
  const { formId } = useBuilderForm();
  const query = useBuilderQuery();
  const { requestNavigation } = useBuilderNavigation();
  const { document } = useBuilderEditor();
  const activeSegment = getActiveBuilderSegment(pathname, formId);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <aside className="flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <nav className="flex flex-1 flex-col">
          {builderNavItems.map((item) => {
            const isActive = activeSegment === item.id;
            const href = `${builderHref(formId, item.segment)}${query}`;

            if (item.id === "share") {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setShareOpen(true)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 px-2 py-4 text-xs font-medium leading-tight transition-colors",
                    "text-sidebar-foreground hover:bg-primary/10 hover:text-sidebar-foreground",
                  )}
                >
                  <item.icon className="size-5 shrink-0" stroke={1.5} aria-hidden />
                  <span className="text-center">{item.title}</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => requestNavigation(href)}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-2 py-4 text-xs font-medium leading-tight transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-primary/10 hover:text-sidebar-foreground",
                )}
              >
                {isActive ? (
                  <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-sidebar-primary" />
                ) : null}
                <item.icon className="size-5 shrink-0" stroke={1.5} aria-hidden />
                <span className="text-center">{item.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <ShareFormDialog
        slug={document.slug}
        published={document.status === "published"}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </>
  );
}
