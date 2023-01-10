const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageReactionRemove,
	async execute(reaction,user) {
        //Fetch reaction if reaction was made on uncached message
        if (reaction.partial){
            try {
                await reaction.fetch()
            } catch (error) {
                console.error('Something went wrong when fetching the message: ',error);
            }
        }
        const fetchedMessage = reaction.message; 
        //Check if reacted to roles message
        if (!global.hasOwnProperty('rolesMessageId')){
            global.rolesMessageId = '1058740155172802631';
        }
        if (fetchedMessage.id == global.rolesMessageId){
            if (reaction._emoji.name ==  '🏃‍♂️'){
                var role = fetchedMessage.guild.roles.cache.find(role => role.name === "VTV");
                var userMember = await fetchedMessage.guild.members.fetch(user.id);
                userMember.roles.remove(role).catch(console.error);
                //user.roles.add(role).catch(console.error);
                const test = true;
            }
            if (reaction._emoji.name ==  '🤸‍♂️'){
                var role = fetchedMessage.guild.roles.cache.find(role => role.name === "Reverse VTV");
                var userMember = await fetchedMessage.guild.members.fetch(user.id);
                userMember.roles.remove(role).catch(console.error);
                const test = true;
            }

        }
    }
}