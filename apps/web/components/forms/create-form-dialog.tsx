"use client";

import type { Icon } from "@tabler/icons-react";
import { IconLayout, IconPlus, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

import { CreateBlankFormDialog } from "~/components/forms/create-blank-form-dialog";
import { TemplateGalleryDialog } from "~/components/forms/template-gallery-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

type CreateFormOption = {
  id: string;
  title: string;
  description: string;
  icon: Icon;
  iconClassName: string;
  iconBgClassName: string;
  href?: string;
  comingSoon?: boolean;
  onSelect?: () => void;
};

const createFormOptions: CreateFormOption[] = [
  {
    id: "blank",
    title: "Blank form",
    description: "Create from scratch with an empty form.",
    icon: IconPlus,
    iconClassName: "text-primary",
    iconBgClassName: "bg-accent",
  },
  {
    id: "ai",
    title: "AI forms",
    description: "Generate forms instantly with AI assistance.",
    icon: IconSparkles,
    iconClassName: "text-sidebar-primary",
    iconBgClassName: "bg-sidebar-accent",
    comingSoon: true,
  },
  {
    id: "templates",
    title: "Form templates",
    description: "Choose from pre-built forms to get started faster.",
    icon: IconLayout,
    iconClassName: "text-chart-2",
    iconBgClassName: "bg-muted",
  },
];

type CreateFormDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

export function CreateFormDialog({ open, onOpenChange, trigger }: CreateFormDialogProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [blankFormOpen, setBlankFormOpen] = useState(false);

  const options: CreateFormOption[] = createFormOptions.map((option) => {
    if (option.id === "templates") {
      return {
        ...option,
        onSelect: () => {
          onOpenChange?.(false);
          setGalleryOpen(true);
        },
      };
    }

    if (option.id === "blank") {
      return {
        ...option,
        onSelect: () => {
          onOpenChange?.(false);
          setBlankFormOpen(true);
        },
      };
    }

    return option;
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
        <DialogContent
          showCloseButton
          className="max-w-3xl gap-0 overflow-hidden border-border/60 p-0 sm:max-w-3xl"
        >
          <div className="bg-background px-6 py-8 text-center sm:px-10">
            <DialogHeader className="items-center space-y-2">
              <DialogTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
                Choose how to create your form
              </DialogTitle>
              <DialogDescription className="max-w-md text-sm text-muted-foreground">
                Start blank, use AI, or pick a template — you can customize everything later.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="grid gap-4 bg-background p-6 sm:grid-cols-3 sm:p-8">
            {options.map((option) => (
              <CreateFormOptionCard
                key={option.id}
                option={option}
                onNavigate={() => onOpenChange?.(false)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <TemplateGalleryDialog open={galleryOpen} onOpenChange={setGalleryOpen} />
      <CreateBlankFormDialog open={blankFormOpen} onOpenChange={setBlankFormOpen} />
    </>
  );
}

type CreateFormOptionCardProps = {
  option: CreateFormOption;
  onNavigate?: () => void;
};

function CreateFormOptionCard({ option, onNavigate }: CreateFormOptionCardProps) {
  const IconComponent = option.icon;

  const cardContent = (
    <>
      {option.comingSoon ? (
        <Badge
          variant="secondary"
          className="absolute right-3 top-3 bg-primary text-primary-foreground shadow-sm"
        >
          Coming soon
        </Badge>
      ) : null}

      <div
        className={cn(
          "mx-auto flex size-14 items-center justify-center rounded-2xl",
          option.iconBgClassName,
        )}
      >
        <IconComponent className={cn("size-7", option.iconClassName)} stroke={1.5} aria-hidden />
      </div>

      <div className="space-y-2 text-center">
        <h3 className="text-base font-semibold text-foreground">{option.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{option.description}</p>
      </div>
    </>
  );

  const cardClassName = cn(
    "relative flex h-full min-h-[200px] flex-col items-center justify-center gap-5 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-xs transition-all",
    option.comingSoon
      ? "cursor-not-allowed opacity-90"
      : "hover:border-ring/50 hover:bg-muted/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  );

  if (option.comingSoon) {
    return (
      <div className={cardClassName} aria-disabled="true">
        {cardContent}
      </div>
    );
  }

  if (option.onSelect) {
    return (
      <button type="button" className={cn(cardClassName, "cursor-pointer")} onClick={option.onSelect}>
        {cardContent}
      </button>
    );
  }

  if (option.href) {
    return (
      <Link href={option.href} className={cardClassName} onClick={() => onNavigate?.()}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={cardClassName} aria-disabled="true">
      {cardContent}
    </div>
  );
}

type CreateFormButtonProps = React.ComponentProps<typeof Button>;

export function CreateFormButton({ children, ...buttonProps }: CreateFormButtonProps) {
  return (
    <CreateFormDialog
      trigger={
        <Button {...buttonProps}>
          {children ?? (
            <>
              <IconPlus className="size-4" />
              New form
            </>
          )}
        </Button>
      }
    />
  );
}
