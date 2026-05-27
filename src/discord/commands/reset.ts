import { createCommand } from "#base";
import { env } from "#env";
import {
    ApplicationCommandType,
    EmbedBuilder,
    InteractionContextType,
    MessageFlags,
    PermissionFlagsBits,
} from "discord.js";

const RESET_WEBHOOK_URL = `${env.WEBHOOK_URL}/reset`;

export default createCommand({
    name: "reset",
    description: "Reseta os scores do servidor (requer administrador)",
    type: ApplicationCommandType.ChatInput,
    contexts: [InteractionContextType.Guild],
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    async run(interaction) {
        // Reforço caso as permissões padrão sejam sobrescritas nas configurações do servidor
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            const deniedEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("❌ Você precisa de permissão de administrador para usar este comando.");

            await interaction.reply({ embeds: [deniedEmbed], flags: MessageFlags.Ephemeral });
            return;
        }

        await interaction.deferReply();

        const res = await fetch(RESET_WEBHOOK_URL, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        console.log(res)

        if (!res.ok) {
            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("❌ Não foi possível resetar os scores. Tente novamente mais tarde.");

            await interaction.editReply({ embeds: [errorEmbed] });
            return;
        }

        const successEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("✅ Scores resetados com sucesso.");

        await interaction.editReply({ embeds: [successEmbed] });
    },
});
