import { runAgent1 } from "./agents/agent1.js";
import { runAgent2 } from "./agents/agent2.js";
import { runAgent3 } from "./agents/agent3.js";
import { runAgent4 } from "./agents/agent4.js";
import { runAgent5 } from "./agents/agent5.js";
import { runAgent6 } from "./agents/agent6.js";

async function main() {
  const prompt = "Hallo, teste alle Agents.";

  const results = await Promise.all([
    runAgent1(prompt),
    runAgent2(prompt),
    runAgent3(prompt),
    runAgent4(prompt),
    runAgent5(prompt),
    runAgent6(prompt)
  ]);

  results.forEach((res, i) => {
    console.log(`Agent${i + 1}:`, res);
  });
}

main();
