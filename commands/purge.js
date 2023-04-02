const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes the specified number of messages from the channel.')
        .addIntegerOption(option => option.setName('count').setDescription('The number of messages to delete.').setRequired(true))
        .addIntegerOption(option => option.setName('days').setDescription('The number of days to look back for messages.').setRequired(true)),
    async execute(interaction) {
        const count = interaction.options.getInteger('count');
        const days = interaction.options.getInteger('days');
        const date = new Date();
        date.setDate(date.getDate() - days);
        await interaction.reply(`Deleting ${count} messages older than ${days} days...`);
        const messages = await interaction.channel.messages.fetch({ before: date });
        await interaction.channel.bulkDelete(messages.filter(msg => !msg.pinned).first(count), true);
        return interaction.channel.send(`Deleted ${count} messages older than ${days} days.`).then(msg => {
            setTimeout(() => msg.delete(), 5000);
        });
    },
};
