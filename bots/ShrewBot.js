
//wiggle the fraggle is a lodash?
var _ = require('lodash');

//define the emoji that I'm all about. I don't think I need this
//var shrew_emoji = ['sandshrew'];

//words of ancient voodoo provided by scott to whisper gently over my bot
var _contains = function(str, list){
	return _.some(list, (word)=>{
		return _.includes(str.toLowerCase(), word.toLowerCase());
	});
};

//define shrew messages
var isShrewRequest = function(msg){
	return _contains(msg, ['choose','go']) && _contains(msg, ['Sandshrew','shrewbro']);
	};

	
	
//random junk maybe? Will I need it someday, only time will tell.	
//var isShrewDismiss = function(msg){
//	return _contains(msg, ['Sandshrew good job', 'Sandshrew that's enough']);	

//do the shit
module.exports = {
	listenFor : ['message'],	
	response : function(msg, info, Higgins){
      		if(info.user == 'meggeroni' && isShrewRequest(msg)){
			  Higgins.react('sandshrew');
    	  		}
			
		}	
	};	
