#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
const cwd = process.cwd();
const localMain = path.join(cwd, "node_modules/systemjs-server/server/main.js");

fileExists(localMain).then(exists => {
    if(exists) {
        require(localMain);
    }
    else {
        require("../server/main");
    }
});

export function fileExists(filePath) {
    return new Promise(function (resolve, reject) {
        fs.stat(filePath, function (err, stats) {
            if (err) {
                if (err.code == "ENOENT") {
                    resolve(false);
                }
                else {
                    reject(err);
                }
            }
            else {
                resolve(stats.isFile());
            }
        });
    });
}

