var dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz("2014-06-01 12:00", "America/New_York");

dayjs("2021-09-13T06:00:00.000+00:00").tz("Africa/Lagos");

dayjs.tz.guess();

dayjs.tz.setDefault("America/New_York");
console.log(dayjs().format("dddd,HH:mm:ss"));
const { $H, $m, $W } = dayjs(dayjs()).tz("Africa/Lagos");
console.log(`${$H}:${$m}`);
// console.log(dayjs());
console.log(dayjs.en.weekdays[$W]);
console.log(dayjs("2021-09-13T06:00:00.000+00:00").tz("Africa/Lagos"));
