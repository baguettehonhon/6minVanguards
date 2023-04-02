const { Events } = require('discord.js');
const talkedRecently = new Set();
const bawnInsults = ["get scouting you Danish snail", "yo Snorelax, put down the macdo and start the scouting", " time to bellyflop out of the water you whale, get scouting", "moooooooooo get scouting","SCOUT OR ELSE"]
const replyMap = new Map();
const VTV = new Set(['Vasa', 'Tekton', 'Vespula']);
const rVTV = new Set(['Vespula', 'Tekton', 'Vasa']);
const megaScale = new Set(['Guardians','Tightrope','Shamans','Thieving','Mystics']);
const Crope = new Set(['Crabs', 'Tightrope']);
const VTVRole = "<@&1058709382554198119>";
const rVTVRole = "<@&1058709541648351274>";
const duoRecRole = "<@&1047901877330776114>";

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        //Check if it is in scouts-channel.
        if (message.channelId != '1047713972931006486') return;
        //USERNAME SCOUT ALERT
        if (message.author.username != 'SCOUT ALERT') return;
        //Raid taken message
        //Remove this message and all scout messages associated with it
        if (message.content.includes(' - Raid Taken. Now Scouting.') || message.content.includes(' - Logged out')) {
            //Name of the scouter
            scouter = message.content.replace(' - Raid Taken. Now Scouting.', '').replace(' - Logged out', '');
            //Fetch all messages in the channel
            fetcher = await message.channel.messages.fetch();
            leaveMessages = fetcher.filter(x => x.content === message.content);
            fetcherFiltered = fetcher.filter(x => x.embeds.length > 0);
            scoutsToDelete = fetcherFiltered.filter(x => x.embeds[0].title === scouter);
            try {
                await message.channel.bulkDelete(scoutsToDelete);
                await message.channel.bulkDelete(leaveMessages);
            } catch (error) {
                if (error.code === 10008) {
                    // Handle the error when the message was not found
                    console.log(`Failed to delete a message: ${error.message}`);
                } else {
                    // Handle other errors
                    console.log(`An error occurred while deleting messages: ${error.message}`);
                }
            }
            if (replyMap.has(scouter)) {
                const id = replyMap.get(scouter);
                deleteMessage(message, id);
                replyMap.delete(scouter);
            }
        }
        //Check every message
        if (message.embeds.length > 0) {
            //Checks the embed of it for VTV etc etc
            if (isVTV(message.embeds[0].description)) {
                if(checkCrope(message.embeds[0].description)) {
                    var replyId = await message.reply(duoRecRole).then(m => m.id);
                } else {
                    var replyId = await message.reply(VTVRole).then(m => m.id);
                }
                replyMap.set(message.embeds[0].title, replyId);
            } else if (isReverseVTV(message.embeds[0].description)) {
                if(checkCrope(message.embeds[0].description)) 
                {
                    var replyId = await message.reply(duoRecRole).then(m => m.id);
                } else {
                    var replyId = await message.reply(rVTVRole).then(m => m.id);
                }
                replyMap.set(message.embeds[0].title, replyId);
            } else if (isMegaScale(message.embeds[0].description)) {
                //Second check for layout
                if(checkMegaScaleLayout(message)) {
                    var replyId = await message.reply('MEGASCALE ALERT').then(m => m.id);
                    replyMap.set(message.embeds[0].title, replyId);
                }
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
function checkMegaScaleLayout(message) {
    //Just check if the field name is called Layout and find the value of that ez clap
    const layoutValue = message.embeds[0].fields.find(f => f.name === "Layout").value;
    //Regex to check if [FS or [SF matches
    return /^(\[FS|\[SF)/.test(layoutValue)
}

function isMegaScale(description) {
    var scoutList = getScoutRooms(description);
    return scoutContainsRooms(scoutList, megaScale);
}

function isReverseVTV(description) {
    var scoutList = getScoutRooms(description);
    return scoutContainsRoomsInOrder(scoutList, rVTV) && scoutContainsRooms(scoutList, Crope);
}

function isVTV(description) {
    var scoutList = getScoutRooms(description);
    return scoutContainsRoomsInOrder(scoutList, VTV) && scoutContainsRooms(scoutList, Crope);
}

function checkCrope(description) {
    var scoutList = getScoutRooms(description);
    return scoutContainsRoomsInOrder(scoutList, Crope);
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

async function deleteMessage(message, messageId) {
    try {
        const m = await message.channel.messages.fetch(messageId);
        if(m){
            m.delete();
        }
    } catch (err) {
        if (err.code === 10008) {
            console.log("Message not found");
        } else {
            console.log(err);
        }
    }
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