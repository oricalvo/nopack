import * as winston from 'winston';
import * as debug from "debug";
import * as moment from "moment";

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    colorize: true,
    timestamp: function() {
        return moment().format('HH:mm:ss:SSS');
    }
});

export function debug(message) {
    winston.log("debug", message);
}

export function info(message) {
    winston.log("info", message);
}

export function warn(message) {
    winston.log("warn", message);
}

export function error(message) {
    console.error(message);
}
