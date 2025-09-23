import { runAgent1 } from "./agents/agent1.js";
import { runAgent2 } from "./agents/agent2.js";
import { runAgent3 } from "./agents/agent3.js";
import { runAgent4 } from "./agents/agent4.js";
import { runAgent5 } from "./agents/agent5.js";
import { runAgent6 } from "./agents/agent6.js";

async function main() {
  console.log(await runAgent1("Hallo Agent1"));
  console.log(await runAgent2("Hallo Agent2"));
  console.log(await runAgent3("Hallo Agent3"));
  console.log(await runAgent4("Hallo Agent4"));
  console.log(await runAgent5("Hallo Agent5"));
  console.log(await runAgent6("Hallo Agent6"));
}

main();
