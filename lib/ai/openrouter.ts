import axios from "axios";

export async function callOpenRouter(prompt: string, apiKey: string) {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: [
        {
          role: "system",
          content:
            "You are an expert web data extractor AI. Given HTML and instructions, respond only with JSON.",
        },

        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
}
