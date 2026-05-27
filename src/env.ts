import { validateEnv } from "@constatic/base";
import { z } from "zod";
import "./constants.js";

export const env = await validateEnv(z.looseObject({
    BOT_TOKEN: z.string("Discord Bot Token is required").min(1),
    WEBHOOK_URL: z.url("Base URL dos webhooks do n8n é obrigatória"),
    WEBHOOK_LOGS_URL: z.url().optional(),
    GUILD_ID: z.string().optional()
}));