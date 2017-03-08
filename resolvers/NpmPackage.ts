import * as path from "path";
import * as configurator from "../core/configurator";
import {IResolver} from "./resolver";
import {fileExists, readJson, findFileWithExtensions} from "../helpers/fs";
import {logger} from "../core/logger";

const config = configurator.get();

export class ResolverNpmPackage implements IResolver {
    get name() {
        return "NpmPackage";
    }

    resolve(packageName: string): Promise<string> {
        const packageJson = path.join(config.basePath, "node_modules/" + packageName + "/package.json");
        return fileExists(packageJson).then((exists) => {
            if(!exists) {
                logger.log("SKIP NpmPackage lookup since package.json: " + packageJson + " was not found");
                return "";
            }

            return readJson(packageJson).then((json) => {
                if(!json.main) {
                    logger.log("SKIP NpmPackage lookup since package.json has main attribute");
                    return "";
                }

                const location = "node_modules/" + packageName + "/" + json.main;
                return findFileWithExtensions(config.basePath, location, ["", "js"]);
            });
        });
    }
}
