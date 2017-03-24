import * as configurator from "../core/configurator";
import * as server from "../server/main";
import * as open2 from "open";
import * as promiseHelpers from "build-utils/promise";
import * as logger from "../core/logger";

let config: Configuration;
let nobrowser: boolean = false;

run();

async function run() {
    try {
        config = await configurator.load();

        await parseArgs();

        await server.run();

        if(!nobrowser) {
            await promiseHelpers.delay(1500);

            await openBrowser();
        }
    }
    catch(err) {
        console.error(err);
    }
}

function parseArgs() {
    process.argv.forEach(function (val, index, array) {
        if(val == "-nobrowser") {
            nobrowser = true;
        }
    });
}

function openBrowser() {
    return Promise.resolve().then(function() {
        if (!config.indexHtmlLocation) {
            logger.error("Failed to detect index.html");
            return;
        }

        open2("http://localhost:" + config.port + "/" + config.indexHtmlLocation);
    });
}
