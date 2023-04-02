const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears the channel.'),
		
	async execute(interaction) {
		await interaction.reply(`Clearing channel`);
		fetcher = await interaction.channel.messages.fetch();
		await interaction.channel.bulkDelete(fetcher);
	},
};