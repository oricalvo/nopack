import {IResolver} from "./resolver";
import * as configurator from "../core/configurator";
import {logger} from "../core/logger";
import {findFileWithExtensions} from "../helpers/fs";

export class ResolverUnderNpmPackageDistFolder implements IResolver {
    get name() {
        return "underNpmPackageDistFolder";
    }

    resolve(fileName: string): Promise<string> {
        return Promise.resolve().then(() => {
            if(fileName.indexOf("/")!=-1) {
                logger.log("SKIP underNpmPackageDistFolder lookup since " + fileName + " is not considered a file name");
                return Promise.resolve("");
            }

            const config = configurator.get();
            const relPath = "node_modules/" + fileName + "/dist/" + fileName;
            return findFileWithExtensions(config.basePath, relPath, config.defaultExtensions);
        });
    }
}
