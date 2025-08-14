import { TaskType } from "@/types/tasks";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExecutionEnviroment } from "@/types/executer";
import { WorkflowTask } from "@/types/workflow";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";
import { FillInputExecutor } from "./FillInputExecutor";
import { ClickElementExecutor } from "./ClickElementExecutor";
import { WaitForElementExecutor } from "./WaitForElementExecutor";
import { DeliverViaWebhookExecutor } from "./DeliverByWebhookExecutor";
import { ExtractDataWithAIExecutor } from "./ExtractDataWithAIExecutor";
import { ReadPropertyJsonExecutor } from "./ReadPropertyFromJsonExecutor";
import { AddPropertyToJsonExecutor } from "./AddPropertyToJsonExecutor";
import { NavigateUrlExecutor } from "./NavigateUrlExecutor";
import { ScrollElementExecutor } from "./ScrollElementExecutor";

type ExecutorFn<T extends WorkflowTask> = (
  enviroment: ExecutionEnviroment<T>
) => Promise<boolean>;

type RegistryType = {
  [k in TaskType]: ExecutorFn<WorkflowTask & { type: k }>;
};

export const ExecuterRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAIExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
  NAVIGATE_URL: NavigateUrlExecutor,
  SCROLL_ELEMENT: ScrollElementExecutor,
};
