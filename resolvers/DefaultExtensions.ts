import * as configurator from "../core/configurator";
import {IResolver} from "./resolver";
import {findFileWithExtensions} from "../helpers/fs";
import * as path from "path";

export class ResolverDefaultExtensions implements IResolver {
    get name() {
        return "defaultExtensions";
    }

    resolve(location: string) {
        const config = configurator.get();
        return findFileWithExtensions(config.basePath, location, config.defaultExtensions);
    }
}
