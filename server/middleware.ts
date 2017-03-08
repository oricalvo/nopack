import {logger} from "../core/logger";
const fs = require("fs");
import {
    ResolverCollection, ResolverUnderNpmPackageDistFolder, ResolverNpmPackage,
    ResolverSystemJSPlugin, ResolverDefaultExtensions, ResolverNull, ResolverUnderNodeModulesFolder
} from "../resolvers/index";
import * as configurator from "../core/configurator";
import * as fsHelpers from "../helpers/fs";
import * as cheerio from "cheerio";

export const resolvers = new ResolverCollection("global", [
    //
    //  app/main ==> app/main.js
    //
    new ResolverDefaultExtensions(),

    //
    //  rxjs/Subject ==> node_module/rxjs/Subject.js
    //
    new ResolverUnderNodeModulesFolder(),

    //
    //  jquery ==> node_modules/jquery/dist/jquery.js
    //
    new ResolverUnderNpmPackageDistFolder(),

    //
    //  redux ==> node_modules/redux/package.json ==> node_modules/redux/index.js
    //
    new ResolverNpmPackage(),

    //
    //  text ==> node_modules/systemjs-plugin-text
    //
    new ResolverSystemJSPlugin(),

    //
    //  XXX ==> XXX
    //
    new ResolverNull(),
]);

function nodeStyleToPromise(func, arg) {
    return new Promise(function(resolve, reject) {
        func(arg, function(value, err) {
            if(err) {
                reject(err);
            }

            resolve(value);
        });
    });
}

export function setup(app) {
    if(!app) {
        throw new Error("SystemJS middleware setup must receive a reference to an express application instance");
    }

    logger.log("The following resolvers are installed");
    for(let resolver of resolvers.resolvers) {
        logger.log("    " + resolver.name);
    }
    logger.log("");

    app.get("/", (req, res)=> {
        logger.log("");

        const config = configurator.get();
        fsHelpers.readFileContent(config.indexHtmlLocation).then(content => {
            const detailsJSON = JSON.stringify(config);
            const $ = cheerio.load(content);
            $("body").append(`<script>var SystemJServerConfig = ${detailsJSON};</script>\n`);
            $("body").append(`<script src="node_modules/systemjs-server/client/systemjs.server.js"></script>\n`);
            res.write($.html());
            res.end();
        });
    });

    app.get("/systemjs/init", (req, res)=> {
        logger.log("systemjs/init");

        configurator.reload().then(config => {
            res.json(config);
        }).catch(err=> {
            res.status(500);
            res.statusMessage = err.message;
            res.end();
        });
    });

    app.get('/systemjs/locate', function(req, res) {
        logger.log("HTTP GET: " + req.url);

        const path = req.query.path;
        logger.log("    Locate: " + path);

        resolvers.resolve(path)
            .then(path => {
                logger.log("    Found: " + path);
                logger.log("");

                res.json({
                    path: path,
                }).end();
            })
            .catch(function(err) {
                console.error(err);
                logger.log("");

                res.json({
                    err: err,
                }).end();
            });
    });
}
