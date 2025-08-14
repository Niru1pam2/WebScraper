import { ExecutionEnviroment } from "@/types/executer";

import { ExtractDataWithAITask } from "../task/ExtractDataWithAI.jsx";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import { callOpenRouter } from "@/lib/ai/openrouter";

export async function ExtractDataWithAIExecutor(
  enviroment: ExecutionEnviroment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = enviroment.getInput("Credentials");
    if (!credentials) {
      enviroment.log.error("input->credentials not defined");
    }

    const prompt = enviroment.getInput("Prompt");
    if (!prompt) {
      enviroment.log.error("input->prompt not defined");
    }

    const html = enviroment.getInput("Html");
    if (!html) {
      enviroment.log.error("input->html not defined");
    }

    const credential = await prisma.credential.findUnique({
      where: {
        id: credentials,
      },
    });

    const fullPrompt = `${html},  ${prompt}`;

    if (!credential) {
      enviroment.log.error("credential not found");
      return false;
    }

    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) {
      enviroment.log.error("cannot decrypt credential");
      return false;
    }

    const openrouter = await callOpenRouter(fullPrompt, plainCredentialValue);

    enviroment.setOutput("Json", openrouter);

    return true;
  } catch (error: any) {
    enviroment.log.error(error.message);

    return false;
  }
}
