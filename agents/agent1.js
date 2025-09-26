// agents/agent1.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * runAgent1(message, contexts, username)
 * - message: die aktuelle User-Nachricht
 * - contexts: Array von gespeicherten Kontext-Texten (slot1, slot2 falls vorhanden)
 * - username: optional, nur zur Protokollierung
 */
export async function runAgent1(message, contexts = [], username = "unknown") {
  // Baue die messages-Liste für das Chat-Endpoint:
  // Wir packen die gespeicherten Kontexte als system-Nachrichten voran,
  // damit sie das Verhalten des Modells beeinflussen.
  const messages = [];

  // Füge jeden gespeicherten Kontext als system message hinzu
  for (const c of contexts) {
    messages.push({ role: "system", content: `User context: ${c}` });
  }

  messages.push({ role: "system", content: "Du bist Agent1, der sich über Gesundheit auskennt." });


  // Option: Du kannst auch eine kurze system-Message mit meta-info hinzufügen
  messages.push({ role: "system", content: `Conversation for user: ${username}, agent: agent1` });

  // Agent weiß jetzt: diese Kontexte darf er nennen
  messages.push({ role: "system", content: `Du darfst die folgenden Kontexte dem Benutzer nennen: ${contexts.join(" | ")}`});

  // Dann die aktuelle User-Nachricht
  messages.push({ role: "user", content: message });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages
  });

  return completion.choices[0].message.content;
}
