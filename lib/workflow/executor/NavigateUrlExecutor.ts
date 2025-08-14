import { ExecutionEnviroment } from "@/types/executer";

import { NavigateUrl } from "../task/NavigateUrl.jsx";

export async function NavigateUrlExecutor(
  enviroment: ExecutionEnviroment<typeof NavigateUrl>
): Promise<boolean> {
  try {
    const url = enviroment.getInput("Url");
    if (!url) {
      enviroment.log.error("input->url not defined");
    }

    await enviroment.getPage()!.goto(url);
    enviroment.log.info(`Visited ${url}`);

    return true;
  } catch (error: any) {
    enviroment.log.error(error.message);

    return false;
  }
}
