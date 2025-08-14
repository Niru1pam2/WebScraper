import { ExecutionEnviroment } from "@/types/executer";

import { ClickElement } from "../task/ClickElement.jsx";

export async function ClickElementExecutor(
  enviroment: ExecutionEnviroment<typeof ClickElement>
): Promise<boolean> {
  try {
    const seletor = enviroment.getInput("Selector");
    if (!seletor) {
      enviroment.log.error("input->selector not defined");
    }

    await enviroment.getPage()!.click(seletor);

    return true;
  } catch (error: any) {
    enviroment.log.error(error.message);

    return false;
  }
}
