"use client";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "@/schema/workflow";
import { CopyIcon, Layers2Icon, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DuplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";
import { cn } from "@/lib/utils";

function DuplicateWorkflowDialog({ workflowId }: { workflowId?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<duplicateWorkflowSchemaType>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      name: "",
      description: "",
      workflowId,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: (id) => {
      toast.success("Workflow duplicated", { id: "duplicate-workflow" });
      router.push(`/workflow/editor/${id}`);
      setOpen((prev) => !prev);
    },
    onError: () => {
      toast.error("Failed to duplicate workflow", { id: "duplicate-workflow" });
    },
  });

  const onSubmit = useCallback(
    (values: duplicateWorkflowSchemaType) => {
      toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className={cn(
            "ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100"
          )}
        >
          <CopyIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader Icon={Layers2Icon} title="Duplicate workflow" />
        <div className="p-8">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a description and unique name
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                      <p className="text-xs text-primary">(optional)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what your workflow does.{" "}
                      <br /> This is optional but can help you remember the
                      workflow&apos; purpose later.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Proceed"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default DuplicateWorkflowDialog;
