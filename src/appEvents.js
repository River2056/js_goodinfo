const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const { fetchStockSnapShot } = require('./fetchSnapshot');
const bot = require('./bot');

const eventEmitter = new EventEmitter();

const fetchImageFolder = stockId => {
    const imageFolder = fs.readdirSync('./output/');
    return imageFolder.filter(image => image.startsWith(stockId));
};

eventEmitter.on('fetch-stock', async stockId => {
    console.log(`start fetching ${stockId}...`);
    await fetchStockSnapShot(stockId);
    console.log(`done fetching ${stockId}!`);
});

eventEmitter.on('send-snapshot', async (stockId, msg) => {
    let stockImageArray = fetchImageFolder(stockId);
    let stockImage = null;
    let stockName = null;
    if(stockImageArray != null && stockImageArray != undefined && stockImageArray.length > 0) {
        stockImage = fs.readFileSync(path.join('./output', stockImageArray[0]));
        stockName = stockImageArray[0].slice(0, stockImageArray[0].lastIndexOf('.'));
    } else {
        bot.sendMessage(msg.chat.id, 'snapshot not found, fetching from web...');
        await fetchStockSnapShot(stockId);
        stockImageArray = fetchImageFolder(stockId);
        stockImage = fs.readFileSync(path.join('./output', stockImageArray[0]));
        stockName = stockImageArray[0].slice(0, stockImageArray[0].lastIndexOf('.'));
    }
    bot.sendPhoto(msg.chat.id, stockImage, { caption: stockName });
});

eventEmitter.on('clear-files', () => {
    console.log('start clearing server files...');
    const imageFolder = fs.readdirSync('./output/');
    if(imageFolder != null && imageFolder != undefined && imageFolder.length > 0) {
        imageFolder.forEach(image => {
            fs.unlinkSync(path.join('./output', image));
        });
    }
})

module.exports = eventEmitter;