import { ExecutionEnviroment } from "@/types/executer";
import { ExtractTextFromElement } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(
  enviroment: ExecutionEnviroment<typeof ExtractTextFromElement>
): Promise<boolean> {
  try {
    const selector = enviroment.getInput("Selector");
    if (!selector) {
      enviroment.log.error("Selector not defined");
      return false;
    }

    const html = enviroment.getInput("Html");
    if (!html) {
      enviroment.log.error("html not defined");

      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      enviroment.log.error("element not found");
      return false;
    }

    const extractedText = $.text(element);

    if (!extractedText) {
      enviroment.log.error("Element has no text");

      return false;
    }

    enviroment.setOutput("Extracted text", extractedText);
    return true;
  } catch (error: any) {
    enviroment.log.error(error.message);

    return false;
  }
}
