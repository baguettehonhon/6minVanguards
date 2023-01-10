const { Events } = require('discord.js');
const talkedRecently = new Set();
const bawnInsults = ["get scouting you Danish snail", "yo Snorelax, put down the macdo and start the scouting", " time to bellyflop out of the water you whale, get scouting", "moooooooooo get scouting"]
const replyMap = new Map();


module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		//Clear bot messages.
		//console.log(message);

		//Check if it is in scouts-channel.
		if (message.channelId == '1047713972931006486') {

			//SCOUT ALERT
			if (message.author.username == 'SCOUT ALERT') {
				//Raid taken message
				//Remove this message and all scout messages associated with it
				if (message.content.includes(' - Raid Taken. Now Scouting.'))
				{
					//Find corresponding message.
	
					//Name of the scouter
					scouter = message.content.replace(' - Raid Taken. Now Scouting.', '');
	
					fetcher = await message.channel.messages.fetch();
					leaveMessages = fetcher.filter(x => x.content === scouter + ' - Raid Taken. Now Scouting.');
					fetcherFiltered = fetcher.filter(x => x.embeds.length > 0 );
					scoutsToDelete = fetcherFiltered.filter(x => x.embeds[0].title === scouter);
					await message.channel.bulkDelete(scoutsToDelete);
					await message.channel.bulkDelete(leaveMessages);
					if (replyMap.has(scouter)){
						const id = replyMap.get(scouter);
						message.channel.messages.fetch(id).then(m => m.delete())
						replyMap.delete(scouter);
					}
					// console.log(scoutsToDelete);
				}
				if (message.content.includes(' - Logged out')){
					//Find corresponding message.
	
					//Name of the scouter
					scouter = message.content.replace(' - Logged out', '');
	
					fetcher = await message.channel.messages.fetch();
					leaveMessages = fetcher.filter(x => x.content === scouter + ' - Logged out');
					fetcherFiltered = fetcher.filter(x => x.embeds.length > 0 );
					scoutsToDelete = fetcherFiltered.filter(x => x.embeds[0].title === scouter);
					await message.channel.bulkDelete(scoutsToDelete);
					await message.channel.bulkDelete(leaveMessages);
					if (replyMap.has(scouter)){
						const id = replyMap.get(scouter);
						message.channel.messages.fetch(id).then(m => m.delete())
						replyMap.delete(scouter);
					}
					console.log(scoutsToDelete);
				}
				if (message.embeds.length > 0){
					if (isVTV(message.embeds[0].description)){
						var replyId = await message.reply('<@&' + '1058709382554198119' + '>').then(m => m.id);
						replyMap.set(message.embeds[0].title, replyId);

					}
					if (isReverseVTV(message.embeds[0].description)){
						var replyId = await message.reply('<@&' + '1058709541648351274' + '>').then(m => m.id);
						replyMap.set(message.embeds[0].title, replyId);
					}
				}
			}
		}
		//Flame Michel
		// if (message.author.id == '207281758167760896'){
		// 	if (!talkedRecently.has(message.author.id)) {
		// 		message.channel.send("<@" + message.author.id + "> \n https://media.discordapp.net/attachments/343126281782558720/988778022331088986/unknown.png").then(sentMessage => sentMessage.react('1051947680466751590'));
		// 		talkedRecently.add(message.author.id);
		// 		setTimeout(() => {
		// 			  // Removes the user from the set after an hour
		// 			  talkedRecently.delete(message.author.id);
		// 		}, 3600000);
		// 	}
		// }
		//#region CommandParsing
		if (message.content.startsWith("!")){
			//!scout command
			if (message.content === "!scout"){
				const random = Math.floor(Math.random() * bawnInsults.length);
				message.channel.send("<@" + '645395113152872449' + "> " + bawnInsults[random]).then(sentMessage => sentMessage.react('1051947680466751590'));
			}
			//#region MyMessages
			//Check if i'm the author 
			// if (message.author.id == '209429220131209216'){
			// 	//Default roles message.
			// 	if (message.content === "!rolesmessage"){
			// 		var rolesChannel = message.guild.channels.cache.find(channel => channel.name === "roles");
			// 		const messageSent = rolesChannel.send(
            // 			"React to this message with the role you want to be pinged with when a bot finds that type of scout.\n" + 
           	// 			"VTV: 🏃‍♂️\n"+
            // 			"Reverse VTV: 🤸‍♂️\n"
			// 			//"VTG: "
			// 			)
			// 			.then(sentMessage => {
			// 				sentMessage.react('🏃‍♂️')
			// 				sentMessage.react('🤸‍♂️')
			// 			})
			// 			global.rolesMessageId = message.id;
			// 			message.delete();
			// 			return;
			// 	}
				// if (message.content === "!test"){
				// 	var replyId = await message.reply('<@&' + '1058709382554198119' + '>').then(m => m.id);
				// 	replyMap.set('me', replyId);
					
				// }
				// if (message.content === "!delete"){
				// 	const test = true;
				// 	if (replyMap.has('me')){
				// 		const id = replyMap.get('me');
				// 		message.channel.messages.fetch(id).then(m => m.delete())
				// 		replyMap.delete('me');
				// 	}
				// }
				// if (message.content.startsWith("!rolesmessage")){
				// 	var rolesChannel = message.guild.channels.cache.find(channel => channel.name === "roles");
				// 	rolesChannel.send(
            	// 		"React to this message with the role you want to be pinged with when a bot finds that type of scout.\n" + 
            	// 		"VTV: 🏃‍♂️\n" +
            	// 		"Reverse VTV: 🤸‍♂️\n" + 
				// 		""
        		// 	);
				// 	var t = true;
				// }
			}
			//#endregion
		}
		//#endregion
	}
//}

function isVTV(description){
	console.log('Checking if VTV');
	console.log(description);
	return scoutContainsRoomsInOrder(description,['Vasa','Tekton','Vespula'])
			&& scoutContainsRooms(description,['Tightrope','Crabs']);
}
function isReverseVTV(description){
	console.log('Check if Reverse VTV');
	console.log(description);
	return scoutContainsRoomsInOrder(description,['Vespula','Tekton','Vasa'])
			&& scoutContainsRooms(description,['Tightrope','Crabs']);
}

//Can contain duplicate room --> need different function for large scouts
function scoutContainsRooms(scoutDescription,wantedRoomsList)
{
	var scoutTrimmed = scoutDescription.substring(1,scoutDescription.length - 1);
	var scoutList = scoutTrimmed.split(', ');
	var wantedRoomsSet = new Set(wantedRoomsList);


	for (const scoutRoom of scoutList){
		if (wantedRoomsSet.has(scoutRoom)){
			wantedRoomsSet.delete(scoutRoom);
		}
	}
	var result = wantedRoomsSet.size == 0;
	console.log(`Scout ${result ? 'contains': "does not contain"} wanted rooms :${wantedRoomsList.toString()}`);
	return result;
}

function scoutContainsRoomsInOrder(scoutDescription,wantedRoomsList){
	var scoutTrimmed = scoutDescription.substring(1,scoutDescription.length - 1);
	var scoutList = scoutTrimmed.split(', ');
	var resultList = [];

	var wantedRoomsIndex = 0
	for (const scoutRoom of scoutList){
		if (wantedRoomsList[wantedRoomsIndex] == scoutRoom){
			resultList.push(scoutRoom);
			wantedRoomsIndex++;
			if (wantedRoomsIndex == wantedRoomsList.length){
				break;
			}
		}
	}
	var result = resultList.length == wantedRoomsList.length;
	console.log(`Scout ${result ? 'contains': "does not contain"} wanted rooms :${wantedRoomsList.toString()} in the correct order`);
	return result;
}