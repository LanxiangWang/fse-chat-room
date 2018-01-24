// jan 1st 1970 00:00:00 am  -- unit timestamp

// 1000 - 1s -- 1970 00:00:01 am

const moment = require('moment');

// var date = new Date();
// console.log(date.getMonth());



// 2018-01-20T16:10:01-05:00
// console.log(date.format());

// Jan
// console.log(date.format('MMM'));

// Jan 2018
// console.log(date.format('MMM YYYY'));

// date.add(1, 'years').subtract(9, 'months');

// console.log(date.format('MMM Do, YYYY'));
var someTimestamp = new Date().getTime();
console.log(someTimestamp);
var date = moment(someTimestamp);
console.log(date.format('h:mm a'));



