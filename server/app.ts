import * as path from "path";
import * as express from "express";
import * as systemjsMiddleware from "./middleware";
import * as configurator from "../core/configurator";
import {logger} from "../core/logger";

export function run() {
    configurator.reload().then(config => {
        const app = express();

        systemjsMiddleware.setup(app);

        app.use(express.static(config.basePath));

        app.listen(config.port, function () {
            logger.log('systemjs-server is running on port ' + config.port);
            logger.log("");
        });
    });
}
