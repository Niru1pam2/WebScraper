import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import Topbar from "../../_components/topbar/Topbar";
import { Suspense } from "react";
import { InboxIcon, Loader2Icon } from "lucide-react";
import ExecutionsTable from "./_components/ExecutionsTable";

export default async function ExecutionsPage({
  params,
}: {
  params: {
    workflowId: string;
  };
}) {
  const { workflowId } = await params;
  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        workflowId={workflowId}
        hideButtons
        title="All runs"
        subtitle="List of all your workflow runs"
      />
      <Suspense
        fallback={
          <div>
            <Loader2Icon className="animate-spin" size={30} />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  );
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);
  if (!executions) {
    return <div>No data</div>;
  }

  if (executions.length === 0) {
    return (
      <div className=" w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center">
            <InboxIcon size={40} className="stroke-primary flex items-center" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No runs have been triggered yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" py-6">
      <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  );
}
