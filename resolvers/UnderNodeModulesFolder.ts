import {IResolver} from "./resolver";
import * as configurator from "../core/configurator";
import {findFileWithExtensions} from "../helpers/fs";

export class ResolverUnderNodeModulesFolder implements IResolver {
    get name() {
        return "underNodeModulesFolder";
    }

    resolve(relPath: string) {
        const config = configurator.get();
        const location = "node_modules/" + relPath;
        return findFileWithExtensions(config.basePath, location, config.defaultExtensions);
    }
}
