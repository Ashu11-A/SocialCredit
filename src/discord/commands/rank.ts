import { createCommand } from "#base";
import { env } from "#env";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import { generateRankImage, type RankEntry } from "../../images/rank.js";

const RANK_WEBHOOK_URL = `${env.WEBHOOK_URL}/rank`;

const DEFAULT_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png";

type WebhookEntry = { userId: string; username?: string; score: number };

export default createCommand({
    name: "rank",
    description: "Visualiza o ranking de score de todos os usuários",
    async run(interaction) {
        await interaction.deferReply();

        const res = await fetch(RANK_WEBHOOK_URL, { method: "GET" });

        if (!res.ok) {
            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("Não foi possível carregar o ranking. Tente novamente mais tarde.");

            await interaction.editReply({ embeds: [errorEmbed] });
            return;
        }

        const data = await res.json() as WebhookEntry[];
        const raw = (Array.isArray(data) ? data : [data]).sort((a, b) => b.score - a.score);

        if (raw.length === 0) {
            const emptyEmbed = new EmbedBuilder()
                .setColor("Grey")
                .setDescription("Nenhum usuário encontrado no ranking.");

            await interaction.editReply({ embeds: [emptyEmbed] });
            return;
        }

        const entries: RankEntry[] = await Promise.all(
            raw.map(async (entry) => {
                let username = entry.username ?? `@${entry.userId}`;
                let avatarUrl = DEFAULT_AVATAR;

                try {
                    const user = await interaction.client.users.fetch(entry.userId);
                    username = user.displayName;
                    avatarUrl = user.displayAvatarURL({ size: 128, extension: "png" });
                } catch { /* keep defaults */ }

                return { userId: entry.userId, username, score: entry.score, avatarUrl };
            })
        );

        const imageBuffer = await generateRankImage(entries);
        const attachment = new AttachmentBuilder(imageBuffer, { name: "rank.png" });

        await interaction.editReply({ files: [attachment] });
    },
});
