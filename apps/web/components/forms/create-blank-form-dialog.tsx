"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { trpc } from "~/trpc/client";

const blankFormSchema = z.object({
  name: z.string().trim().min(1, "Form name is required").max(100),
});

type BlankFormValues = z.infer<typeof blankFormSchema>;

type CreateBlankFormDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CreateBlankFormDialog({ open, onOpenChange }: CreateBlankFormDialogProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<BlankFormValues>({
    resolver: zodResolver(blankFormSchema),
    defaultValues: { name: "" },
  });

  const createMutation = trpc.forms.create.useMutation({
    onSuccess: (doc) => {
      void utils.forms.list.invalidate();
      onOpenChange?.(false);
      router.push(
        `/dashboard/builder/${doc.id}?name=${encodeURIComponent(doc.title)}`,
      );
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    if (!open) {
      form.reset({ name: "" });
    }
  }, [open, form]);

  const handleSubmit = form.handleSubmit(({ name }) => {
    createMutation.mutate({ title: name });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="gap-0 border-border/60 p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border/60 px-6 py-5">
          <DialogTitle className="text-lg font-semibold">Create from scratch</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5">
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="form-name">Form name</FieldLabel>
              <FieldContent>
                <Input
                  id="form-name"
                  placeholder="Enter form name"
                  autoFocus
                  aria-invalid={!!form.formState.errors.name}
                  {...form.register("name")}
                />
                <FieldError errors={[form.formState.errors.name]} />
              </FieldContent>
            </Field>
          </div>

          <div className="flex justify-end gap-3 border-t border-border/60 px-6 py-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              Create form
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
