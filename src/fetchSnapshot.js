const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { getDatetime } = require('./helper');

const fetchStockSnapShot = async stockId => {
    let { year, month, day, hour, minute, second } = getDatetime();
    const baseUrl = `https://goodinfo.tw/StockInfo/ShowK_Chart.asp?STOCK_ID=${stockId}&CHT_CAT2=DATE`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(baseUrl);

    // open bollinger bands
    await page.waitForSelector('#btnStockChartSetting');
    await page.click('#btnStockChartSetting');
    await page.select('#CFG_KLine_Type', 'BollingerBands');
    // confirm button
    await page.click('#StockCanvas_divConfig > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(1) > button');

    // save canvas image to file
    const canvasImage = await page.$eval('#StockCanvas', elem => elem.toDataURL('image/png'));
    const imageFile = canvasImage.replace(/data:([A-Za-z-+\/]+);base64,/, '');

    // delete old file before save
    const imagesFolder = fs.readdirSync('./output/');
    imagesFolder.forEach(image => {
        if(image.startsWith(stockId)) {
            fs.unlinkSync(path.join('./output', image));
        }
    });
    fs.writeFileSync(`./output/${stockId}_${year}-${month}-${day}_${hour}:${minute}:${second}.png`, imageFile, { encoding: 'base64' });
    console.log(`done saving ${stockId}`);
    await browser.close();
}

module.exports = {
    fetchStockSnapShot
}