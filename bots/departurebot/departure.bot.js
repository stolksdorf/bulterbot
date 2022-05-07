const _ = require('lodash');
const fs = require('fs');
const Slack = require('../../utils/pico-slack');

const quotes = fs.readFileSync('./bots/departurebot/departure.quotes.txt', 'utf8').split('\n');

Slack.emitter.on('member_left_channel', (data)=>{
	Slack.msg(data, `_${_.sample(quotes)}_`);
});
