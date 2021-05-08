const fs = require('fs');
const eventEmitter = require('./src/appEvents');
const bot = require('./src/bot');
const scheduler = require('./src/jobs');
const markets = require('./markets.json');

if(!fs.existsSync('./output/')) {
    fs.mkdirSync('./output/');
}

const helpMessage = 
`Enter stock code to fetch related stock snapshots
commands: 
/start - greet and show predefined keyboard
/help - show instructions

input stock code(numbers) to fetch stock info snapshot
`;

const keyboardObjs = markets.map(market => ({ 'text': market, 'callback_data': market }));
let totalArr = [];
let arr = [];
if(keyboardObjs.length > 3) {    
    for(let i = 0; i < keyboardObjs.length; i++) {
        if(arr.length !== 3) {
            arr.push(keyboardObjs[i]);
        } else {
            totalArr.push(arr);
            arr = [];
            arr.push(keyboardObjs[i]);
        }
    }
    // push remaining elements
    if(arr.length > 0) {
        totalArr.push(arr);
    }
}

bot.onText(/\/start/, msg => {
    
    bot.sendMessage(
        msg.chat.id, 
        'Welcome to River2056\'s stock snapshot bot',
        {
            'reply_markup': {
                'keyboard': [
                    [{ 'text': '/help', 'callback_data': '/help' }],
                    ...totalArr
                ]
            }
        }
    );
});

bot.onText(/\/help/, msg => {
    bot.sendMessage(
        msg.chat.id,
        helpMessage
    );
});

bot.on('message', msg => {
    const regex = /[0-9]+/;
    const market = msg.text.toString();
    if(regex.test(market)) {
        bot.sendMessage(msg.chat.id, `start fetching stock ${market}`);
        eventEmitter.emit('send-snapshot', market, msg);
    }
});

process.on('exit', () => scheduler.stop());