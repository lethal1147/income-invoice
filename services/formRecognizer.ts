import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";

export const readMenuFromReceiptImage = async (file: File) => {
  try {
    const endpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT;
    const key = process.env.AZURE_FORM_RECOGNIZER_KEY;
    if (!endpoint || !key) throw new Error("Key or Endpoint is missing.");

    const buffer = Buffer.from(await file.arrayBuffer());

    const client = new DocumentAnalysisClient(
      endpoint,
      new AzureKeyCredential(key)
    );
    const poller = await client.beginAnalyzeDocument("prebuilt-read", buffer);
    const poll = await poller.pollUntilDone();
    return poll;
  } catch (err) {
    throw err;
  }
};
