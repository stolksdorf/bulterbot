const _ = require('lodash');
const Slack = require('../utils/pico-slack');
const catEmojis = ['cat', 'cat2', 'smiley_cat', 'joy_cat', 'heart_eyes_cat', 'smile_cat'];

Slack.onMessage((msg)=>{
	if(msg.user == 'meggeroni' && _.random(15) == 3){
		Slack.react(msg, _.sample(catEmojis));
	}
});