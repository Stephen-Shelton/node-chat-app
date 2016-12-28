var moment = require('moment');

//unix epic is Jan 1st 1970 00:00:00 am
//timestamp of 0 represents this moment in history
//negative values represent time before unix epic, positive values are after
//-1000 as time stamp represents 1000ms or 1sec before unix epic, i.e. Dec 31 1969 at 11:59:59
//1000 represents Jan 1st 1970 00:00:01 am

// var date = new Date();
// console.log(date.getMonth());

var date = moment();
date.add(100, 'year').subtract(9, 'months');
console.log(date.format('MMM Do, YYYY'));
console.log(date.format('h:mm a'));
console.log(date.format('LT'));

var someTimestamp = moment().valueOf();
console.log(someTimestamp);
