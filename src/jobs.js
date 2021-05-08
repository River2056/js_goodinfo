const fs = require('fs');
const path = require('path');
const config = require('../config/botConfig.json');
const eventEmitter = require('./appEvents');
const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler');
const { jobOptions } = require('./helper');

const scheduler = new ToadScheduler();

const clearServerFiles = new Task('clear-server-files', () => {
    eventEmitter.emit('clear-files');
});

const clearJob = new SimpleIntervalJob(jobOptions(config), clearServerFiles);
scheduler.addSimpleIntervalJob(clearJob);

module.exports = scheduler;