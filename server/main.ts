import * as configurator from "../core/configurator";
import * as open2 from "open";
import {dirExists} from "../helpers/fs";
import {logger} from "../core/logger";
import * as express from "express";
import * as middleware from "./middleware";

validate()
    .then(runServer)
    .then(openBrowser)
    .catch(err => {
        logger.error(err.message);
    });

function validate() {
    return dirExists("node_modules/nopack").then(exists => {
        if (!exists) {
            throw new Error("Local nopack was not found. Please run 'npm install nopack'");
        }
    });
}

export function runServer() {
    configurator.reload().then(config => {
        const app = express();

        middleware.setup(app);

        app.use(express.static(config.basePath));

        app.listen(config.port, function () {
            logger.log("nopack is running");
            logger.log("   port: " + config.port);
            logger.log("   serving static files from: " + config.basePath);
            logger.log("");
        });
    });
}

function openBrowser() {
    const config = configurator.get();
    open2("http://localhost:" + config.port);
}
