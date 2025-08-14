import { ExecutionEnviroment } from "@/types/executer";

import { WaitForElement } from "../task/WaitForElement.jsx";

export async function WaitForElementExecutor(
  enviroment: ExecutionEnviroment<typeof WaitForElement>
): Promise<boolean> {
  try {
    const seletor = enviroment.getInput("Selector");
    if (!seletor) {
      enviroment.log.error("input->selector not defined");
    }

    const visibility = enviroment.getInput("Visibility");
    if (!visibility) {
      enviroment.log.error("input->visibility not defined");
    }

    await enviroment.getPage()!.waitForSelector(seletor, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });

    enviroment.log.info(`Element ${seletor} became: ${visibility}`);

    return true;
  } catch (error: any) {
    enviroment.log.error(error.message);

    return false;
  }
}
