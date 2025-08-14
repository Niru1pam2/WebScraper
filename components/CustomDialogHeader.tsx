"use client";

import { LucideIcon } from "lucide-react";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface Props {
  title?: string;
  subTitle?: string;
  Icon?: LucideIcon;

  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

function CustomDialogHeader({
  Icon,
  subTitle,
  title,
  iconClassName,
  subtitleClassName,
  titleClassName,
}: Props) {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {Icon && (
            <Icon size={30} className={cn("stroke-primary", iconClassName)} />
          )}
          {title && (
            <p className={cn("text-xl text-primary", titleClassName)}>
              {title}
            </p>
          )}

          {subTitle && (
            <p
              className={cn("text-muted-foreground text-sm", subtitleClassName)}
            >
              {subTitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
}
export default CustomDialogHeader;
