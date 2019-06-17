var assert = require('assert');
var cron = require('node-cron');
var Utils = require("./utils");
const config = require("./config.json");

assert(cron.validate(config.tweetSchedule), "The tweet schedule isn't valid. Check config.json.");

cron.schedule(config.tweetSchedule, Utils.tweet);