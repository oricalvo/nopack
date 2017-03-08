import {logger} from "../core/logger";
import {or} from "../helpers/promise";

export interface IResolver {
    name: string;
    resolve(path: string): Promise<string>;
}

export function resolveFiles(resolver: IResolver, locations) {
    const funcs = [];

    for(let location of locations) {
        funcs.push(() => resolver.resolve(location));
    }

    return or(funcs);
}

export class ResolverNull implements IResolver {
    get name() {
        return "asIs";
    }

    resolve(location: string) {
        logger.log(location);

        return Promise.resolve(location);
    }
}

