import { ExecutionEnviroment } from "@/types/executer";

import { DeliverViaWebhook } from "../task/DeliverViaWebhook.jsx";

export async function DeliverViaWebhookExecutor(
  enviroment: ExecutionEnviroment<typeof DeliverViaWebhook>
): Promise<boolean> {
  try {
    const targetUrl = enviroment.getInput("Target URL");
    if (!targetUrl) {
      enviroment.log.error("input->targetUrl not defined");
    }

    const body = enviroment.getInput("Extracted text");
    console.log(body);
    if (!body) {
      enviroment.log.error("input->Body not defined");
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const statusCode = response.status;
    if (statusCode !== 200) {
      enviroment.log.error(`Status code ${statusCode} recieved`);
      return false;
    }

    const responseBody = await response.json();
    enviroment.log.info(JSON.stringify(responseBody, null, 4));

    return true;
  } catch (error: any) {
    enviroment.log.error(error.message);

    return false;
  }
}
