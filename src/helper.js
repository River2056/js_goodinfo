const getDatetime = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return { year, month, day, hour, minute, second };
}

const jobOptions = (config) => {
    const obj = {};
    const timeUnit = config['timeUnit'];
    const timeInterval = parseInt(config['timeInterval']);
    obj[timeUnit] = timeInterval;
    return obj
};

module.exports = {
    getDatetime,
    jobOptions
}