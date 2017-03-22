/// <reference path="../core/configurator.ts" />

(function() {
    "use strict";

    let head;

    function sequence(factories) {
        return new Promise(function(resolve, reject) {
            let index = -1;

            function next(prevValue?) {
                if (++index == factories.length) {
                    resolve();
                    return;
                }

                const promise = factories[index](prevValue);
                if(promise && promise.then) {
                    promise.then(function (value) {
                        next(value);
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    next(promise);
                }
            }

            next();
        });

    }

    function loadScript(src): Promise<any> {
        if(!src) {
            return Promise.resolve();
        }

        return new Promise(function(resolve, reject) {
            const script = document.createElement("script");
            script.src = src;

            script.onload = function () {
                resolve();
            }

            script.onerror = function (err) {
                reject(err);
            }

            head.appendChild(script);
        });
    }

    function loadMiddlewareConfig() {
        return fetch("nopack/config")
            .then(res => res.json());
    }

    function loadSystemJS(config) {
        if(window["SystemJS"]) {
            //
            //  SystemJS is already loaded
            //  Probably the user just included SystemJS inside index.html
            //  No need to load it again
            //
            return;
        }

        return loadScript(config.systemJSLocation).then(function() {
            SystemJS.config({
                meta: {
                    "*.html": {
                        loader: "text"
                    }
                }
            });
        });
    }

    function loadSystemJSConfig(location) {
        return Promise.resolve().then(function() {
            if(location) {
                return loadScript(location);
            }
        });
    }

    function importMain(main) {
        if(!main) {
            console.log();
            console.error("nopack failed to detect main file to import");
            return;
        }

        return SystemJS.import(main);
    }

    function validateConfig(config) {
        if(!config.systemJSLocation) {
            console.error("Failed to detect system.src.js location");
            return;
        }

        if(!config.systemJSHookLocation) {
            console.error("Failed to detect systemjs.middleware.js location");
            return;
        }
    }

    function init() {
        head = document.querySelector("head");
        if(!head) {
            throw new Error("head element was not found");
        }

        let config: Configuration;

        return sequence([
            () => loadMiddlewareConfig(),
            (_config) => config = _config,
            () => validateConfig(config),
            () => loadSystemJS(config),
            () => loadSystemJSConfig(config.systemJSConfigLocation),
            () => loadScript(config.systemJSHookLocation),
            () => importMain(config.mainLocation),
        ]);
    }

    document.addEventListener("DOMContentLoaded", function() {
        init();
    });
})();

declare function fetch(url: string): Promise<any>;

