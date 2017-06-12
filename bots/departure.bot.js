const _ = require('lodash');
const Slack = require('pico-slack');

const quotes = [
	'_Absence diminishes little passions and increases great ones, as the wind extinguishes candles and fans a fire._',
	'_Adieu! I have too grieved a heart to take a tedious leave._',
	'_All changes, even the most longed for, have their melancholy; for what we leave behind us is a part of ourselves; we must die to one life before we can enter another._',
	'_As contraries are known by contraries, so is the delight of presence best known by the torments of absence._',
	'_As the presence of those we love is as a double life, so absence, in its anxious longing and sense of vacancy, is as a foretaste of death._',
	'_Be well, do good work, and keep in touch._',
	'_But fate ordains that dearest friends must part._',
	'_Can miles truly separate you from friends? If you want to be with someone you love, aren’t you already there?_',
	'_Close the door on your way out._',
	'_Don’t be dismayed at goodbyes. A farewell is necessary before you can meet again. And meeting again, after moments or lifetime, is certain for those who are friends._',
	'_Don’t cry because it’s over, smile because it happened._',
	'_Ever has it been that love knows not its own depth until the hour of separation._',
	'_Every parting is a form of death, as every reunion is a type of heaven._',
	'_Excuse me, then! You know my heart;\nBut dearest friends, alas! must part._',
	'_Fare thee well! and if for ever,\nStill for ever, fare thee well._',
	'_Farewell! Thou art too dear for my possessing._',
	'_Farewell, my sister, fare thee well.\nThe elements be kind to thee, and make\nThy spirits all of comfort: fare thee well._',
	'_Give me now leave, to leave thee._',
	'_Go thy ways._',
	'_God save you, sir!_',
	'_Gone — flitted away,\nTaken the stars from the night and the sun\nFrom the day!\nGone, and a cloud in my heart._',
	'_Good riddance._',
	'_Great is the art of beginning, but greater is the art of ending._',
	'_How lucky I am to have something that makes saying goodbye so hard._',
	'_I wanted a perfect ending. Now I’ve learned, the hard way, that some poems don’t rhyme, and some stories don’t have a clear beginning, middle, and end. Life is about not knowing, having to change, taking the moment and making the best of it, without knowing what’s going to happen next._',
	'_If I had a single flower for every time I think of you, I could walk forever in my garden._',
	'_It’s time to say goodbye, but I think goodbyes are sad and I’d much rather say hello. Hello to a new adventure._',
	'_Let the best of the past be the worst of the future_',
	'_Love is missing someone whenever you’re apart, but somehow feeling warm inside because you’re close in heart._',
	'_Love reckons hours for months, and days for years; and every little absence is an age._',
	'_Man’s feelings are always purest and most glowing in the hour of meeting and of farewell._',
	'_May flowers always line your path and sunshine light your day.\nMay songbirds serenade you every step along the way.\nMay a rainbow run beside you in a sky that’s always blue.\nAnd may happiness fill your heart each day your whole life through._'
	'_May the road rise up to meet you, may the wind be ever at your back. May the sun shine warm upon your face and the rain fall softly on your fields. And until we meet again, may God hold you in the hollow of his hand._',
	'_May the sun shine, all day long,\neverything go right, and nothing wrong.\nMay those you love bring love back to you,\nand may all the wishes you wish come true!_',
	'_May you always have walls for the winds,\na roof for the rain, tea beside the fire,\nlaughter to cheer you, those you love near you,\nand all your heart might desire._',
	'_May you always have work for your hands to do.\nMay your pockets hold always a coin or two.\nMay the sun shine bright on your windowpane.\nMay the rainbow be certain to follow each rain.\nMay the hand of a friend always be near you.\nAnd may God fill your heart with gladness to cheer you._',
	'_May you have warm words on a cool evening, a full moon on a dark night, and a smooth road all the way to your door._',
	'_May your days be many and your troubles be few._',
	'_May your pockets be heavy and your heart be light,\nMay good luck pursue you each morning and night._',
	'_Never say goodbye because goodbye means going away and going away means forgetting._',
	'_No distance of place or lapse of time can lessen the friendship of those who are thoroughly persuaded of each other’s worth.',
	'_Not to understand a treasure’s worth till time has stole away the slighted good, is cause of half the poverty we feel, and makes the world the wilderness it is._',
	'_Nothing makes the earth seem so spacious as to have friends at a distance; they make the latitudes and longitudes._',
	'_One kind kiss before we part,\nDrop a tear, and bid adieu;\nThough we sever, my fond heart\nTill we meet shall pant for you._',
	'_Only in the agony of parting do we look into the depths of love._',
	'_Promise me you’ll never forget me because if I thought you would I’d never leave._',
	'_Remember me and smile, for it’s better to forget than to remember me and cry._',
	'_Rest you merry._',
	'_She went her unremembering way,\nShe went and left in me\nThe pang of all the partings gone,\nAnd partings yet to be._',
	'_So long as the memory of certain beloved friends lives in my heart, I shall say that life is good._',
	'_So sweetly she bade me adieu,\nI thought that she bade me return._',
	'_That bitter word, which closed all earthly friendships and finished every feast of love farewell!_',
	'_The pain of parting is nothing to the joy of meeting again._',
	'_The return makes one love the farewell._',
	'_There are no goodbyes for us. Wherever you are, you will always be in my heart._',
	'_There lies your way._',
	'_They must often change, who would be constant in happiness or wisdom._',
	'_To die and part is a less evil; but to part and live, there, there is the torment.',
	'_To part is the lot of all mankind. The world is a scene of constant leave-taking, and the hands that grasp in cordial greeting today, are doomed ere long to unite for the the last time, when the quivering lips pronounce the word – Farewell._',
	'_We only part to meet again._',
	'_What shall I do with all the days and hours\nThat must be counted ere I see thy face?\nHow shall I charm the interval that lowers\nBetween this time and that sweet time of grace?_',
	'_Where is the good in goodbye?_',
	'_Ye flowers that drop, forsaken by the spring,\nYe birds that, left by summer, cease to sing,\nYe trees that fade, when Autumn heats remove,\nSay, is not absence death to those who love?_',
];


Slack.emitter.on('member_left_channel', (data) => {
	Slack.msg(data, _.sample(quotes));
});
