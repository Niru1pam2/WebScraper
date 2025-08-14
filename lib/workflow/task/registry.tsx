import { TaskType } from "@/types/tasks";
import { ExtractTextFromElement } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./PageToHtml";
import { WorkflowTask } from "@/types/workflow";
import { FillInput } from "./FillInput.tsx";
import { ClickElement } from "./ClickElement";
import { WaitForElement } from "./WaitForElement";
import { DeliverViaWebhook } from "./DeliverViaWebhook";
import { ExtractDataWithAITask } from "./ExtractDataWithAI";
import { ReadPropertyFromJsonTask } from "./ReadPropertyFromJson";
import { AddPropertyToJsonTask } from "./AddPropertyToJson";
import { NavigateUrl } from "./NavigateUrl";
import { ScrollElement } from "./ScrollElement";

type Registry = {
  [k in TaskType]: WorkflowTask & { type: k };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement,
  FILL_INPUT: FillInput,
  CLICK_ELEMENT: ClickElement,
  WAIT_FOR_ELEMENT: WaitForElement,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhook,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
  NAVIGATE_URL: NavigateUrl,
  SCROLL_ELEMENT: ScrollElement,
};
