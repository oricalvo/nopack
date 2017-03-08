import {IResolver} from "./resolver";
import {or} from "../helpers/promise";

export class ResolverCollection implements IResolver {
    resolvers: IResolver[];
    resolversByName: {[name: string]: IResolver};

    constructor(public name: string, resolvers: IResolver[]) {
        this.resolvers = resolvers;

        this.resolversByName = {};
        for(let r of this.resolvers) {
            this.ensureNoDuplication(r);

            if (!r.name) {
                throw new Error("xxx");
            }

            this.resolversByName[r.name] = r;
        }
    }

    resolve(location: string): Promise<string> {
        return or(this.resolvers.map(r => {
            return function () {
                return r.resolve(location);
            }
        }));
    }

    private ensureNoDuplication(resolver: IResolver) {
        if(this.resolversByName.hasOwnProperty(resolver.name)) {
            throw new Error("Resolver with name: " + resolver.name + " already exists");
        }
    }

    add(resolver: IResolver) {
        this.ensureNoDuplication(resolver);

        this.resolvers.push(resolver);
        this.resolversByName[resolver.name] = resolver;
    }

    insertAt(index: number, resolver: IResolver) {
        this.ensureNoDuplication(resolver);

        this.resolvers.splice(index, 0, resolver);
        this.resolversByName[resolver.name] = resolver;
    }

    clear() {
        this.resolvers = [];
        this.resolversByName = {};
    }

    remove(name: string) {
        if(!this.resolversByName.hasOwnProperty(name)) {
            return;
        }

        const index = this.resolvers.findIndex(r => r.name == name);
        this.resolvers.splice(index, 1);
        delete this.resolversByName[name];
    }
}
