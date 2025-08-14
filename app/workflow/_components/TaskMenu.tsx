"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/tasks";
import { CoinsIcon } from "lucide-react";
import React from "react";

function TaskMenu() {
  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          "extraction",
          "interaction",
          "timing",
          "results",
          "storage",
        ]}
      >
        <AccordionItem value="interaction">
          <AccordionTrigger className="font-bold">
            User interaction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn tasktype={TaskType.FILL_INPUT} />
            <TaskMenuBtn tasktype={TaskType.NAVIGATE_URL} />
            <TaskMenuBtn tasktype={TaskType.CLICK_ELEMENT} />
            <TaskMenuBtn tasktype={TaskType.SCROLL_ELEMENT} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn tasktype={TaskType.PAGE_TO_HTML} />
            <TaskMenuBtn tasktype={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
            <TaskMenuBtn tasktype={TaskType.EXTRACT_DATA_WITH_AI} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="storage">
          <AccordionTrigger className="font-bold">
            Data storage
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn tasktype={TaskType.READ_PROPERTY_FROM_JSON} />
            <TaskMenuBtn tasktype={TaskType.ADD_PROPERTY_TO_JSON} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="timing">
          <AccordionTrigger className="font-bold">
            Timing controls
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn tasktype={TaskType.WAIT_FOR_ELEMENT} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="results">
          <AccordionTrigger className="font-bold">
            Result delivery
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn tasktype={TaskType.DELIVER_VIA_WEBHOOK} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
export default TaskMenu;

function TaskMenuBtn({ tasktype }: { tasktype: TaskType }) {
  const task = TaskRegistry[tasktype];

  const onDragStart = (event: React.DragEvent, type: TaskType) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button
      variant={"secondary"}
      className="flex justify-between items-center gap-2 border w-full"
      draggable
      onDragStart={(event) => onDragStart(event, tasktype)}
    >
      <div className="flex gap-2">
        <task.icon size={20} />
        {task.label}
      </div>
      <Badge className="gap-2 flex items-center" variant={"outline"}>
        <CoinsIcon size={16} />
        {task.credits}
      </Badge>
    </Button>
  );
}
