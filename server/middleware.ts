import * as logger from "../core/logger";
import * as fs from "fs";
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

    logger.debug("The following resolvers are installed");
    for(let resolver of resolvers.resolvers) {
        logger.debug("    " + resolver.name);
    }
    logger.debug("");

    app.get("/nopack/config", (req, res)=> {
        logger.debug("nopack/config");

        configurator.load().then(config => {
            res.json(config);
        }).catch(err=> {
            res.status(500);
            res.statusMessage = err.message;
            res.end();
        });
    });

    app.get('/nopack/locate', function(req, res) {
        logger.debug("HTTP GET: " + req.url);

        const path = req.query.path;
        logger.debug("    Locate: " + path);

        resolvers.resolve(path)
            .then(path => {
                logger.info(path);

                res.json({
                    path: path,
                }).end();
            })
            .catch(function(err) {
                logger.error(err);
                res.json({
                    err: err,
                }).end();
            });
    });
}
