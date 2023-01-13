const { Events } = require('discord.js');
const talkedRecently = new Set();
const bawnInsults = ["get scouting you Danish snail", "yo Snorelax, put down the macdo and start the scouting", " time to bellyflop out of the water you whale, get scouting", "moooooooooo get scouting","SCOUT OR ELSE"]
const replyMap = new Map();
const VTV = new Set(['Vasa', 'Tekton', 'Vespula']);
const rVTV = new Set(['Vespula', 'Tekton', 'Vasa']);
const megaScale = new Set(['Guardians','Tightrope','Shamans','Thieving','Mystics']);
const PuzzleRooms = new Set(['Tightrope', 'Crabs']);


module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        //Check if it is in scouts-channel.
        if (message.channelId != '1047713972931006486') return;
        //USERNAME SCOUT ALERT
        if (message.author.username != 'SCOUT ALERT') return;
        //Raid taken message
        //Remove this message and all scout messages associated with it
        if (message.content.includes(' - Raid Taken. Now Scouting.')) {
            //Find corresponding message.
            //Name of the scouter
            scouter = message.content.replace(' - Raid Taken. Now Scouting.', '');

            fetcher = await message.channel.messages.fetch();
            leaveMessages = fetcher.filter(x => x.content === scouter + ' - Raid Taken. Now Scouting.');
            fetcherFiltered = fetcher.filter(x => x.embeds.length > 0);
            scoutsToDelete = fetcherFiltered.filter(x => x.embeds[0].title === scouter);
            await message.channel.bulkDelete(scoutsToDelete);
            await message.channel.bulkDelete(leaveMessages);
            if (replyMap.has(scouter)) {
                const id = replyMap.get(scouter);
                message.channel.messages.fetch(id).then(m => m.delete())
                replyMap.delete(scouter);
            }
        }
        if (message.content.includes(' - Logged out')) {
            //Find corresponding message.

            //Name of the scouter
            scouter = message.content.replace(' - Logged out', '');

            fetcher = await message.channel.messages.fetch();
            leaveMessages = fetcher.filter(x => x.content === scouter + ' - Logged out');
            fetcherFiltered = fetcher.filter(x => x.embeds.length > 0);
            scoutsToDelete = fetcherFiltered.filter(x => x.embeds[0].title === scouter);
            await message.channel.bulkDelete(scoutsToDelete);
            await message.channel.bulkDelete(leaveMessages);
            if (replyMap.has(scouter)) {
                const id = replyMap.get(scouter);
                message.channel.messages.fetch(id).then(m => m.delete())
                replyMap.delete(scouter);
            }
        }
        //Check every message
        if (message.embeds.length > 0) {
            //Checks the embed of it for VTV etc etc
            if (isVTV(message.embeds[0].description)) {
                var replyId = await message.reply('<@&' + '1058709382554198119' + '>').then(m => m.id);
                replyMap.set(message.embeds[0].title, replyId);
            } else if (isReverseVTV(message.embeds[0].description)) {
                var replyId = await message.reply('<@&' + '1058709541648351274' + '>').then(m => m.id);
                replyMap.set(message.embeds[0].title, replyId);
            } else if (isMegaScale(message.embeds[0].description)) {
                var replyId = await message.reply('MEGASCALE ALERT').then(m => m.id);
                replyMap.set(message.embeds[0].title, replyId);
			}
        }
        if (message.content.startsWith("!")) {
            //!scout command
            if (message.content === "!scout") {
                const random = Math.floor(Math.random() * bawnInsults.length);
                message.channel.send("<@" + '645395113152872449' + "> " + bawnInsults[random]).then(sentMessage => sentMessage.react('1051947680466751590'));
            }
        }
    }
}

function isMegaScale(description) {
    var scoutList = getScoutRooms(description);
    return scoutContainsRooms(scoutList, megaScale);
}

function isReverseVTV(description) {
    var scoutList = getScoutRooms(description);
    return scoutContainsRoomsInOrder(scoutList, rVTV) && scoutContainsRooms(scoutList, PuzzleRooms);
}

function isVTV(description) {
    var scoutList = getScoutRooms(description);
    return scoutContainsRoomsInOrder(scoutList, VTV) && scoutContainsRooms(scoutList, PuzzleRooms);
}

//Can contain duplicate room --> might need different function for large scouts
function scoutContainsRooms(scoutList, wantedRooms) {
    for (let wantedRoom of wantedRooms) {
        if (!scoutList.has(wantedRoom)) {
            return false;
        }
    }
    return true;
}

function scoutContainsRoomsInOrder(scoutList, wantedRooms) {
    scoutList = [...scoutList];
    wantedRooms = [...wantedRooms];
    scoutIndex = 0;
    totalWanted = 0;
	for(scoutIndex = 0; scoutIndex < scoutList.length; scoutIndex++) 
	{
		if (wantedRooms[totalWanted] == scoutList[scoutIndex]) {
            totalWanted++;
        }
	}
    return totalWanted == wantedRooms.length;
}

function getScoutRooms(description) {
    //Takes the description without apostrophe
    //Split the substring, since it's seperated by ', '
    //Example: [Tekton, Tightrope, Vasa, Guardians, Crabs]
    return new Set(description.substring(1, description.length - 1).split(', '));
}

//Unused?
function scoutDoesNotContainRooms(scoutDescription, unwantedRoomsList) {
    var scoutTrimmed = scoutDescription.substring(1, scoutDescription.length - 1);
    var scoutList = scoutTrimmed.split(', ');
    var unwantedRoomsSet = new Set(unwantedRoomsList);

    for (const scoutRoom of scoutList) {
        if (unwantedRoomsSet.has(scoutRoom)) {
            console.log(`Scout contains unwanted room: ${scoutRoom}`);
            return false;
        }
    }
    console.log(`Scout does not contain unwanted rooms: ${unwantedRoomsList.toString()}`);
    return true;
}