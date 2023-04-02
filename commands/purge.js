const { SlashCommandBuilder } = require('discord.js');
const { SnowflakeUtil } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes the specified number of messages from the channel.')
        .addIntegerOption(option => option.setName('count').setDescription('The number of messages to delete.').setRequired(true)),
    async execute(interaction) {
        const count = interaction.options.getInteger('count');
        const twoWeeksAgo = SnowflakeUtil.now() - (14 * 24 * 60 * 60 * 1000); // 14 days in milliseconds
        const messages = await interaction.channel.messages.fetch({ limit: count, before: twoWeeksAgo });
        await interaction.channel.bulkDelete(messages, true);
        await interaction.channel.send(`Deleted ${messages.size} messages.`).then(msg => {
            setTimeout(() => msg.delete(), 5000);
        });
    },
};
