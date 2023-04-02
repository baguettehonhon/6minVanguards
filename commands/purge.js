const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes the specified number of messages from the channel.')
        .addIntegerOption(option => option.setName('count').setDescription('The number of messages to delete.').setRequired(true)),
    async execute(interaction) {
        const count = interaction.options.getInteger('count');
        await interaction.reply(`Deleting ${count} messages...`);
        await interaction.channel.bulkDelete(count, true);
        return interaction.channel.send(`Deleted ${count} messages.`).then(msg => {
            setTimeout(() => msg.delete(), 5000);
        });
    },
};