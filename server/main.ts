import * as configurator from "../core/configurator";
import * as logger from "../core/logger";
import * as express from "express";
import * as middleware from "./middleware";
import {readFile} from "build-utils/fs";
import * as cheerio from "cheerio";
import * as path from "path";

export async function run() {
    const config = await configurator.load();
    const app = express();

    middleware.setup(app);

    if(config.indexHtmlLocation) {
        //
        //  Inject client script to index.html
        //
        app.get("/" + config.indexHtmlLocation, async (req, res)=> {
            logger.info("Serving index.html");

            try {
                const inject = await readFile(path.resolve(__dirname, "./inject.html"), "utf8");

                const content = await readFile(config.indexHtmlLocation, "utf8");
                const $ = cheerio.load(content);
                $("body").append(inject);

                res.write($.html());
                res.end();
            }
            catch(err) {
                res.statusCode = 500;
                res.statusMessage = err.message;
                res.end();
            }
        });
    }

    app.use(express.static(config.basePath));

    app.listen(config.port, function () {
        logger.info("nopack server is running on port " + config.port);
        logger.info("Static files are served from " + config.basePath);
    });
}
