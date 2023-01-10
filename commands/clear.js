const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears the channel.'),
		
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(`Clearing channel`);
		//console.log("LOOOOOOOOOOOOOOOOOOOOOOOOOOOGGGG");
		fetcher =  await interaction.channel.messages.fetch();
			//.then(message => console.log(message.embeds[0].title))
			//.catch(console.error);
		//console.log(fetcher);
		await interaction.channel.bulkDelete(fetcher);
		return;
		messages = await interaction.channel;
		//console.log(messages);
		//channelFound = await interaction.channel;
		//channelFound.bulkDelete(messages);
	},
};
