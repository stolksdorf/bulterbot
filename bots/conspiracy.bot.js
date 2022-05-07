const _ = require('lodash');
const Slack = require('../utils/pico-slack');

const responses = ['my my', 'why yes!'];

Slack.onMessage((msg)=>{
	//Lock this to just direct messages from chris
	if(!msg.isDirect || msg.user != 'chris') return;

	Slack.log('Why hello!');

	if(Slack.has(msg.text, 'conspiracy?')){
		Slack.msgAs('conspiracybot', ':sleuth_or_spy:', msg.channel, _.sample(responses));
	}

});
