"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

type ShareFormDialogProps = {
  slug: string;
  published: boolean;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ShareFormDialog({
  slug,
  published,
  children,
  open: controlledOpen,
  onOpenChange,
}: ShareFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const url =
    typeof window !== "undefined" ? `${window.location.origin}/f/${slug}` : `/f/${slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    if (!published) {
      toast.message("Link copied", {
        description: "Publish this form before respondents can submit.",
      });
      return;
    }
    toast.success("Share link copied");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share form</DialogTitle>
          <DialogDescription>
            Copy the link or scan the QR code to open your form.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <Image
            src={qrUrl}
            alt="QR code for form link"
            width={180}
            height={180}
            unoptimized
            className="rounded-lg border"
          />
          <div className="flex w-full gap-2">
            <Input readOnly value={url} className="font-mono text-xs" />
            <Button type="button" variant="outline" onClick={() => void copyLink()}>
              Copy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
