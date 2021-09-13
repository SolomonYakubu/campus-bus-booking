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
console.log(
	dayjs("2021-09-13T07:00:00.000+00:00").tz("Africa/Lagos").format("hh:mm")
);
const c = {
	hostel: {
		bus_id: 4,
		departure_time: "2021-09-13T15:45:00.000Z",
	},
	ticket: {
		seat: 2,
		code: "a977",
		student_id: "613783ead7eeb03ac660b78d",
		_id: "613f4c3dee23e93e2190c1b9",
	},
};
console.log(c[Object.keys(c)[0]]);
