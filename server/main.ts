import * as configurator from "../core/configurator";
import * as open2 from "open";
import * as app from "../server/app";
import {dirExists} from "../helpers/fs";
import {logger} from "../core/logger";

validate()
    .then(runServer)
    .then(openBrowser)
    .catch(err => {
        logger.error(err.message);
    });

function validate() {
    return dirExists("node_modules/systemjs-server").then(exists => {
        if (!exists) {
            throw new Error("Local systemjs-server was not found. Please run 'npm install systemjs-server'");
        }
    });
}

function runServer() {
    app.run();
}

function openBrowser() {
    const config = configurator.get();
    open2("http://localhost:" + config.port);
}
