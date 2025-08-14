"use client";

import { DeleteCredential } from "@/actions/credentials/deleteCredential";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  name: string;
}

function DeleteCredentialDialog({ name }: Props) {
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: DeleteCredential,
    onSuccess: () => {
      toast.success("Credential deleted successfully", { id: name });
      setConfirmText("");
    },
    onError: () => {
      toast.error("An error occurred while deleting the Credential", {
        id: name,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"icon"}>
          <XIcon size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              If you delete this credential, you will not be able to recover it.
              <div className="flex flex-col py-4 gap-2 ">
                <span>
                  If you are sure, enter <b>{name} to confirm</b>{" "}
                </span>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== name || deleteMutation.isPending}
            className="bg-red-500 text-white hover:bg-red-400"
            onClick={() => {
              toast.loading("Deleting credential...", { id: name });
              deleteMutation.mutate(name);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default DeleteCredentialDialog;
