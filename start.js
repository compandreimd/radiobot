//Config file
let config = {
	token:"Mzc5NzAxMTMxNTY1MzM0NTI4.DOx0ew.Ttg7DubQKxqTh1Se33xYJ_n7cic", //Token for bot
	VCID: "379877535917539328", // ID of vocal chat
	playlist:[
		"01.mp3",
		"http://66.90.93.122/ost/death-note-ost-iii-part-2-/dqjvgtkaem/06-mello-2.mp3"

	],
	loop: true
};


let Discord = require("discord.io");
let client = new Discord.Client({token:config.token});
let fs = require("fs");
let request = require("request");

client.connect();


/**
 * Play loca or remot
 * @param what what to plat
 * @param where
 */
function  play(index, where) {
	let what = config.playlist[index];
	console.log("Now Playing " + what);
	if(what.lastIndexOf("http") === 0)
		request(what).pipe(where);
	else
		fs.createReadStream(what).pipe(where, {end: false});

}


let i = 0; //Start song at
client.on('ready', function() {
	console.log("%s (%s)", client.username, client.id);

	//Bot join on radio channel
	client.joinVoiceChannel(config.VCID, function(err, events) {
		if (err) return console.error(err);

		//Bot Send what to play
		client.getAudioContext(config.VCID,function(err, stream) {
			if (err) return console.error(err);

			//Start playing
			play(i, stream);

			//End playing
			stream.on('done', function() {
				i++;
				if(i >= config.playlist.length)
					if(config.loop){
						i = 0;
						play(i, stream);
					}
					else
						client.disconnect();
				else
					play(i, stream);

			});
		});
	});
});
