import { ExecutionEnviroment } from "@/types/executer";

import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJson.jsx";

export async function ReadPropertyJsonExecutor(
  enviroment: ExecutionEnviroment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> {
  try {
    const jsonData = enviroment.getInput("Json");
    if (!jsonData) {
      enviroment.log.error("input->jsonData not defined");
    }

    const propertyName = enviroment.getInput("Property name");
    if (!propertyName) {
      enviroment.log.error("input->propertyName not defined");
    }

    const json = JSON.parse(jsonData);

    const propertyValue = json[propertyName.trim()];

    if (propertyValue === undefined) {
      enviroment.log.error("property not found");
      return false;
    }

    enviroment.setOutput("Selector", propertyValue);

    return true;
  } catch (error: any) {
    enviroment.log.error(error.message);

    return false;
  }
}
