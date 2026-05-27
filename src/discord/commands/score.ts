import { createCommand } from "#base";
import { env } from "#env";
import { ApplicationCommandOptionType, AttachmentBuilder, EmbedBuilder, type GuildMember } from "discord.js";
import { generateScoreImage, type ScoreData, type UserRole } from "../../images/score.js";

const SCORE_WEBHOOK_URL = `${env.WEBHOOK_URL}/score`;
const DEFAULT_ACCENT = "#5865F2";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

// Funções ordenadas da mais alta para a mais baixa, sem incluir @everyone
function extractRoles(member: GuildMember): UserRole[] {
    return [...member.roles.cache.values()]
        .filter((role) => role.id !== member.guild.id)
        .sort((first, second) => second.position - first.position)
        .map((role) => ({ name: role.name, color: role.hexColor }));
}

export default createCommand({
    name: "score",
    description: "Consulta o score de um usuário",
    options: [
        {
            name: "user",
            description: "Usuário para consultar o score (padrão: você mesmo)",
            type: ApplicationCommandOptionType.User,
            required: false,
        },
    ],
    async run(interaction) {
        await interaction.deferReply();

        const targetBase = interaction.options.getUser("user") ?? interaction.user;

        // Fetch full user data to get banner + accent color
        const target = await interaction.client.users.fetch(targetBase.id, { force: true });

        const res = await fetch(SCORE_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: target.id }),
        });

        if (!res.ok) {
            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("❌ Não foi possível consultar o score. Tente novamente mais tarde.");

            await interaction.editReply({ embeds: [errorEmbed] });
            return;
        }

        const json = await res.json() as { score?: number; message?: string; [key: string]: unknown };
        const rawScore = json.score ?? json.message ?? JSON.stringify(json);
        const score = typeof rawScore === "number" ? rawScore : Number(rawScore);

        const accentColor = target.accentColor
            ? `#${target.accentColor.toString(16).padStart(6, "0")}`
            : DEFAULT_ACCENT;

        // Dados de servidor (funções + data de entrada) só existem dentro de uma guild
        let roles: UserRole[] = [];
        let joinedServerAt: string | null = null;

        if (interaction.guild) {
            try {
                const member = await interaction.guild.members.fetch(target.id);
                roles = extractRoles(member);
                joinedServerAt = member.joinedAt ? dateFormatter.format(member.joinedAt) : null;
            } catch { /* usuário não está no servidor */ }
        }

        const scoreData: ScoreData = {
            username: target.displayName,
            handle: target.username,
            userId: target.id,
            avatarUrl: target.displayAvatarURL({ size: 128, extension: "png" }),
            bannerUrl: target.bannerURL({ size: 512, extension: "png" }) ?? null,
            accentColor,
            score: isNaN(score) ? 0 : score,
            accountCreatedAt: dateFormatter.format(target.createdAt),
            joinedServerAt,
            roles,
        };

        const imageBuffer = await generateScoreImage(scoreData);
        const attachment = new AttachmentBuilder(imageBuffer, { name: "score.png" });

        await interaction.editReply({ files: [attachment] });
    },
});
