const config = require('pico-conf');
const Slack = require('../utils/pico-slack');
const Gist = require('pico-gist')(config.get('github_token'));

const GistId = '1784c9659fdba9c02ffd9921b069f724';

const TacoChannel = 'tacos';
const TACO_LIMIT = 5;

let tacosAwarded = {};

const fetchMessage = async (channel, ts)=>{
	return Slack.api('channels.history', {
			channel : channel,
			latest : ts,
			inclusive: true,
			count: 1
		})
		.then((res)=>res.messages[0])
};

const getUsersFromMessage = (msg)=>{
	return (msg.match(/\<@U\w*>/g) || [])
		.map((id)=>Slack.users[id.slice(0,-1).slice(2)])
		.filter((user)=>!!user);
};

const send = (channel, msg)=>Slack.alias('burritobot', ':burrito:').send(channel, msg);


const awardTaco = async (bestower, recipient, channel, message, numTacos = 1)=>{
	if(bestower === recipient) return Send.naughtyMessage(bestower);

	const alreadyAwarded = tacosAwarded[bestower] || 0;
	const limit = TACO_LIMIT - alreadyAwarded;

	if(numTacos > limit){
		numTacos = limit;
		Send.tacoLimit(bestower);
	}
	if(numTacos < 1) return;

	Send.award(bestower, recipient, channel, message, numTacos);
	await Gist.append(GistId, {
		taco_history : [{
			bestower, recipient, channel,
			tacos : numTacos,
			ts : (new Date()).toLocaleString()
		}]
	});

	tacosAwarded[bestower] = alreadyAwarded + numTacos;
};

const Send = {
	naughtyMessage : (user)=>{
		send(user, `Hey! I see you trying to give burrito to yourself! Naughty! :ribbon:`);
	},
	tacoLimit : (user)=>{
		send(user, `:rotating_light: You've hit your burrito limit of ${TACO_LIMIT} today. :rotating_light:`);
	},
	award : (bestower, recipient, channel, message, numTacos)=>{
		send(TacoChannel,
			`${bestower} has given ${recipient} a whooping ${numTacos} :burrito: for this gem in #${channel}:\n> ${message}`
		)
	}
};

Slack.onMessage((msg)=>{
	const tacoCount = (msg.text.match(/:burrito:/g) || []).length;
	if(tacoCount === 0) return;

	getUsersFromMessage(msg.text).reduce((prom, user)=>{
		return prom.then(()=>awardTaco(msg.user, user, msg.channel, msg.text, tacoCount));
	}, Promise.resolve());
});

Slack.onReact((react)=>{
	if(react.reaction == 'burrito'){
		fetchMessage(react.item.channel, react.item.ts)
			.then((msg)=>awardTaco(react.user, Slack.users[msg.user], react.channel, msg.text))
			.catch(()=>{})
	}
});