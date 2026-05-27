import { createEvent } from "#base";
import { env } from "#env";

const EVENT_WEBHOOK_URL = `${env.WEBHOOK_URL}/trigger`;

export default createEvent({
    name: "messageCreate",
    event: "messageCreate",
    async run(message) {
        if (message.author.bot || !message.content.trim()) return;

        const timestamp = new Date().toLocaleTimeString("pt-BR");
        console.log(`[${timestamp}] 📨 Mensagem de ${message.author.username} em #${(message.channel as { name?: string }).name ?? message.channelId}: ${message.content || "(sem conteúdo)"}`);

        const res = await fetch(EVENT_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: message.id,
                content: message.content,
                cleanContent: message.cleanContent,
                channelId: message.channelId,
                guildId: message.guildId,
                createdTimestamp: message.createdTimestamp,
                author: {
                    id: message.author.id,
                    username: message.author.username,
                    displayName: message.author.displayName,
                    bot: message.author.bot,
                },
                attachments: [...message.attachments.values()].map(a => ({
                    id: a.id,
                    url: a.url,
                    name: a.name,
                    contentType: a.contentType,
                })),
            }),
        });

        if (res.ok) {
            console.log(`[${timestamp}] ✅ Webhook enviado (${res.status})`);
        } else {
            console.error(`[${timestamp}] ❌ Falha no webhook: ${res.status} ${res.statusText}`);
        }
    },
});
