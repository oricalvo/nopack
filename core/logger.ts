const debug = require("debug");

function log(message) {
    console.log(message);
}

function error(message) {
    console.error(message);
}

export const logger = {
    log: log,
    error: error,
};
