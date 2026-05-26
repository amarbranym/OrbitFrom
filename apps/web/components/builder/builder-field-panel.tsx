"use client";

import { useMemo, useState } from "react";
import { IconSearch } from "@tabler/icons-react";

import { useBuilderEditor } from "~/components/builder/builder-editor-context";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { FIELD_DRAG_TYPE } from "~/lib/builder/constants";
import { builderFieldCategories } from "~/lib/forms/field-library";

export function BuilderFieldPanel() {
  const [query, setQuery] = useState("");
  const { addFieldFromLibrary, pages } = useBuilderEditor();
  const defaultPageId = pages.at(-1)?.id;

  const categories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return builderFieldCategories;

    return builderFieldCategories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.label.toLowerCase().includes(normalized),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [query]);

  return (
    <aside className="flex h-full min-h-0 w-72 shrink-0 flex-col overflow-hidden border-r border-border/60 bg-card">
      <div className="shrink-0 border-b border-border/60 p-3">
        <div className="relative">
          <IconSearch
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-9 bg-background pl-8"
          />
        </div>
      </div>

      <ScrollArea className="h-0 min-h-0 flex-1">
        <div className="space-y-5 p-3">
          {categories.length === 0 ? (
            <p className="px-1 py-6 text-center text-sm text-muted-foreground">
              No fields match your search.
            </p>
          ) : (
            categories.map((category) => (
              <section key={category.id}>
                <h3 className="mb-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {category.label}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {category.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData(FIELD_DRAG_TYPE, item.id);
                        event.dataTransfer.effectAllowed = "copy";
                      }}
                      onClick={() => addFieldFromLibrary(item.id, defaultPageId)}
                      className="flex flex-col items-center gap-1.5 rounded-sm border border-border/60 bg-background px-2 py-3 text-center text-xs font-medium text-foreground transition-colors hover:border-dotted hover:border-primary hover:bg-muted/30"
                    >
                      <item.icon className="size-5 text-muted-foreground" stroke={1.5} aria-hidden />
                      {item.label}
                    </button>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
