const fs = require('fs');
const path = require('path');
const config = require('../config/jobConfig.json');
const eventEmitter = require('./appEvents');
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const { jobOptions } = require('./helper');
const markets = require('../markets.json');

const scheduler = new ToadScheduler();

const clearServerFiles = new Task('clear-server-files', () => {
    eventEmitter.emit('clear-files');
});

const updateSnapShots = new Task('update-snapshots', () => {
    markets.forEach(market => {
        eventEmitter.emit('fetch-stock', market);
    });
});

const clearJob = new SimpleIntervalJob(jobOptions(config), clearServerFiles);
const updateJob = new SimpleIntervalJob(jobOptions(config), updateSnapShots);
scheduler.addSimpleIntervalJob(clearJob);
scheduler.addSimpleIntervalJob(updateJob);

module.exports = scheduler;