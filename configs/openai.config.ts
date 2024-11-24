export const COMPLETION_TEMPLATE = {
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: [
        {
          text: `You will be an helper AI that will receive an content text that is response from the ai-form-recognizer (azure).
                That AI will read the receipt's image, and return the text.

                I want you to analyze the text content and return it as JSON.
                Return it in format follow this example : {error:false, menus:[{"name": "Tori Karaage", "quantity": "2", "netPrice": "196", "pricePerItem": "98"}]}.

                If some menus is missing some data like netPrice or menuName, just exclude it.
                If you see that text content is not fit as the menus format, return as {error: true, menus: [], message: ""} and provide error message.
                PS. pricePerItem is coming from netPrice / quantity.
                `,
          type: "text",
        },
      ],
    },
  ],
  temperature: 0.3,
  max_tokens: 5000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  response_format: {
    type: "text",
  },
};
