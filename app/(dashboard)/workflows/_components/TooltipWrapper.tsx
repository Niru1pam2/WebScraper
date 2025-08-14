import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

interface Props {
  children: React.ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
}

function TooltipWrapper({ children, content, side }: Props) {
  if (!content) return children;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
export default TooltipWrapper;
