import { OpenAI } from "openai";
import { COMPLETION_TEMPLATE } from "@/configs/openai.config";

export const submitMessageToGPT = async (message: string) => {
  try {
    const payloadTemplate = { ...COMPLETION_TEMPLATE };
    payloadTemplate.messages = payloadTemplate.messages.concat({
      role: "user",
      content: [{ text: message, type: "text" }],
    });
    const apiKey = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({ apiKey });
    console.log(payloadTemplate);
    const gptResponseMessage = await openai.chat.completions.create(
      payloadTemplate as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming
    );
    const messageToReply = gptResponseMessage.choices[0].message.content;
    return messageToReply
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
  } catch (err) {
    throw err;
  }
};
