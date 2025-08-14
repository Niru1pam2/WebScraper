import { ExecutionEnviroment } from "@/types/executer";

import { FillInput } from "../task/FillInput.tsx";

export async function FillInputExecutor(
  enviroment: ExecutionEnviroment<typeof FillInput>
): Promise<boolean> {
  try {
    const seletor = enviroment.getInput("Selector");
    if (!seletor) {
      enviroment.log.error("input->selector not defined");
    }

    const value = enviroment.getInput("Value");
    if (!value) {
      enviroment.log.error("input->value not defined");
    }

    await enviroment.getPage()!.type(seletor, value);

    return true;
  } catch (error: any) {
    enviroment.log.error(error.message);

    return false;
  }
}
