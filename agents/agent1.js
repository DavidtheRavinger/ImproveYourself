const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Du kannst hier für jeden Agenten andere Prompts setzen
const AGENT_PROMPT = "Du bist ein hilfsbereiter Assistent.";

async function askAgent(question) {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: AGENT_PROMPT + "\n" + question }],
        max_tokens: 500
    });
    return response.data.choices[0].message.content;
}

module.exports = { askAgent };
