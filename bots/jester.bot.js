const Slack = require('pico-slack');

const myFunnyJoke = {
	triggers: ['feeling really triggered', 'ilubb']
	joke: ['ye', 'ye ye', 'ye ye ye']
	who: ['chris']
}

const ohHai = (msg)=>{
	if(Slack.msgHas(msg, ['higgins', 'higgs', 'higgs boson', 'higgerino'], ['hi', 'hello', 'wut up', 'mmm', 'ye'])){
		Slack.send(msg, `Up yours ${msg.user}`);
	}
}

Slack.onMessage(ohHai);
