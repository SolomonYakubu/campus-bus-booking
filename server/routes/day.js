var dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz("2014-06-01 12:00", "America/New_York");

dayjs("2014-06-01 12:00").tz("America/New_York");

dayjs.tz.guess();

dayjs.tz.setDefault("America/New_York");
console.log(dayjs);
