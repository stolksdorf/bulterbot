const config = require('pico-conf');
const Slack = require('../../utils/pico-slack');
const datefns = require('date-fns');
const request = require('superagent');

const S3 = require('../../utils/s3.js');

const MIN = 60 * 1000;
const isProd = config.get('production', true);
const BucketName = config.get('historybot.bucket_name');
const IgnoredChannels = (config.get('historybot.ignored_channels', true) || '').split(',');
const DatabaseToken = config.get('historybot.db_token', true);
const DatabaseApiHost = config.get('historybot.db_host', true);
const wait = async (n,val)=>new Promise((r)=>setTimeout(()=>r(val), n));

let HistoryStorage = {};

const getDate = (ts)=>datefns.format(new Date(ts*1000), 'YYYY-MM-DD H:mm:ss');

const uploadToDatabase = async (endpoint, payload)=>{
	if (!DatabaseToken) return;
	if (!DatabaseApiHost) {
		const msg = '[HistoryBot] Database token has been set but host is still blank!';
		if (isProd) return console.error(msg);
		return console.warn(msg);
	}
	return await request.post(`https://${DatabaseApiHost}/${endpoint}`)
		.set('X-Verification-Token', DatabaseToken)
		.send(payload)
		.catch(console.error);
};

const fetchHistory = async (channel)=>{
	let channelData;
	try{
		channelData = JSON.parse(await S3.fetch(BucketName, `${channel}.json`));
	}catch(err){ channelData = [] }
	if(!HistoryStorage[channel]) return channelData
	return channelData.concat(HistoryStorage[channel]);
}

const saveChannel = async (channel)=>{
	console.log(`Saving ${channel}...`);

	const channelData = await fetchHistory(channel);
	await S3.upload(BucketName, `${channel}.json`, JSON.stringify(channelData));
	delete HistoryStorage[channel];

	console.log(`Finished ${channel}`);
};

const backupAll = async ()=>{
	const channels = Object.keys(HistoryStorage);
	if(!channels.length){
		return;
	}

	await channels.reduce((seq, channel)=>{
		return seq.then(()=>saveChannel(channel)).then(()=>wait(500));
	}, Promise.resolve());
};


const parseMessage = (msgObj)=>{
	return {
		ts : msgObj.ts,
		user : msgObj.user,
		text : msgObj.text,
		thread : msgObj.thread_ts,

		//date : datefns.format(new Date(), 'dd/MMM/yyy - H:mm:ss'), //for v2 of datefns
		//date : datefns.format(new Date(), 'DD/MMM/YYYY - H:mm:ss'),
		//date : datefns.format(new Date(), 'YYYY-MM-DD H:mm:ss'),
	}
}

const storeMessage = (msg)=>{
	const payload = parseMessage(msg);
	HistoryStorage[msg.channel] = (HistoryStorage[msg.channel] || []).concat(payload);

	// Sideload messages into the history database, without blocking.
	uploadToDatabase('messages', Object.assign({}, payload, {
		channel : {
			id : msg.channel_id,
			name : msg.channel,
		},
		user : {
			id : msg.user_id,
			name : msg.user,
		},
	}));
};

const uploadHistoryToSlack = async (channel, dest)=>{
	const content = await fetchHistory(channel);
	const filename = `coolsville-${channel}-history.txt`

	const file = content.map((entry)=>`[${entry.user} ${getDate(entry.ts)}]:${entry.text}`).join('\n');

	await request.post('https://slack.com/api/files.upload')
		.field('token',  Slack.token)
		.field('channels', dest)
		.field('filename',  filename)
		.field('filetype',  'txt')
		.field('title', filename)
		.attach('file', Buffer.from(file), {filename})
};

const uploadJSONToSlack = async (channel, dest)=>{
	const content = await fetchHistory(channel);
	const filename = `coolsville-${channel}-history.json`

	const file = JSON.stringify(content, null, '  ');

	await request.post('https://slack.com/api/files.upload')
		.field('token',  Slack.token)
		.field('channels', dest)
		.field('filename',  filename)
		.field('filetype',  'json')
		.field('title', filename)
		.attach('file', Buffer.from(file), {filename})
}


setInterval(backupAll, config.get('historybot:backup_rate'))

Slack.onMessage(async (msg)=>{
	if(Slack.has(msg.text, 'higgins', 'history', ['please', 'plz', 'channel'])){
		Slack.send(msg.channel, 'Yup, 1 sec...');
		let channel = msg.channel;
		if (msg.isDirect) {
			const matches = /<#[A-Z0-9]+\|([^>]+)>/.exec(msg.text);
			channel = matches[1];
		}
		if(Slack.msgHas(msg.text, 'json')){
			return await uploadJSONToSlack(channel, msg.channel);
		}
		return await uploadHistoryToSlack(channel, msg.channel);
	}

	if(msg.text && !msg.isDirect && !IgnoredChannels.includes(msg.channel)){
		storeMessage(msg);
	}
});

Slack.onReact(async (msg)=>{
	if (msg.item.type != 'message') return;
	return await uploadToDatabase('reactions', {
		ts : msg.ts,
		emoji : msg.reaction,
		user : {
			id : msg.user_id,
			name : msg.user,
		},
		channel : {
			id : msg.channel_id,
			name : msg.channel,
		},
		msg : {
			channel_id : msg.item.channel,
			ts : msg.item.ts,
		},
	});
});
