import * as fsHelpers from "../helpers/fs";
import * as logger from "./logger";
import * as path from "path";

const defaults: Configuration = {
    basePath: process.cwd(),
    defaultExtensions: ["", "js"],
    port: 3000,
    systemJSLocation: null,
    systemJSConfigLocation: null,
    systemJSHookLocation: null,
    mainLocation: null,
    indexHtmlLocation: null,
};

let config: Configuration = null;

export function load(): Promise<Configuration> {
    if(config) {
        return Promise.resolve(config);
    }

    return reload();
}

export function reload(): Promise<Configuration> {
    if(!config) {
        config = defaults;
    }

    logger.debug("Reloading configuration");

    function getSystemJSSrcLocation() {
        return fsHelpers.findFirst([
            "node_modules/systemjs/dist/system.src.js",
        ]);
    }

    function getSystemJSHookLocation() {
        return fsHelpers.findFirst([
            "node_modules/nopack/client/hook.js",
        ]);
    }

    function getSystemJSConfigLocation() {
        return fsHelpers.findFirst([
            "systemjs.config.js",
            "system.config.js"
        ]);
    }

    function getMainLocation() {
        return fsHelpers.findFiles(config.basePath, [
            "main",
            "app/main"
        ], config.defaultExtensions);
    }

    function getIndexHtmlLocation() {
        return fsHelpers.findFirst([
            "index.html",
        ]);
    }

    return Promise.all([
        getSystemJSSrcLocation(),
        getSystemJSConfigLocation(),
        getSystemJSHookLocation(),
        getMainLocation(),
        getIndexHtmlLocation(),
    ]).then(values => {
        config.systemJSLocation = values[0];
        config.systemJSConfigLocation = values[1];
        config.systemJSHookLocation = values[2];
        config.mainLocation = values[3];
        config.indexHtmlLocation = values[4];
        console.log("");

        dump();

        return config;
    });
}

export function get() : Configuration {
    if(!config) {
        throw new Error("Configuration was not loaded yet");
    }

    return config;
}

export function set(c: Configuration) {
    for(let key in config) {
        if(c.hasOwnProperty(key)) {
            config[key] = c[key];
        }
    }

    return config;
}

export function dump() {
    logger.debug("Configuration");
    logger.debug("    basePath: " + config.basePath);
    logger.debug("    port: " + config.port);
    logger.debug("    defaultExtensions: " + config.defaultExtensions);
    logger.debug("    indexHtmlLocation: " + config.indexHtmlLocation);
    logger.debug("    mainLocation: " + config.mainLocation);
    logger.debug("    systemJSLocation: " + config.systemJSLocation);
    logger.debug("    systemJSConfigLocation: " + config.systemJSConfigLocation);
    logger.debug("");
}

export function fullPath(relPath) {
    return path.join(config.basePath, relPath);
}
