import "./discord/commands/index.js";
import "./discord/events/index.js";
import "./images/index.js";
import "./lib/index.js";
import "./types/index.js";

import { env } from "#env";
import { bootstrap } from "@constatic/base";

await bootstrap({ meta: import.meta, env });
