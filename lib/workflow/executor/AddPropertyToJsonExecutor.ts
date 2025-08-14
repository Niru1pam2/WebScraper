import { ExecutionEnviroment } from "@/types/executer";

import { AddPropertyToJsonTask } from "../task/AddPropertyToJson.jsx";

export async function AddPropertyToJsonExecutor(
  enviroment: ExecutionEnviroment<typeof AddPropertyToJsonTask>
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

    const propertyValue = enviroment.getInput("Property value");
    if (!propertyName) {
      enviroment.log.error("input->propertyValue not defined");
    }

    const json = JSON.parse(jsonData);

    json[propertyName] = propertyValue;

    console.log("Add property ", json);

    enviroment.setOutput("Updated JSON", JSON.stringify(json));

    return true;
  } catch (error: any) {
    enviroment.log.error(error.message);

    return false;
  }
}
