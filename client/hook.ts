(function() {
    "use strict";

    hook(System, "locate", function (next) {
        return function (load) {
            return next.apply(this, arguments).then(function(address) {
                const parts = parseUrl(address);
                if (!parts) {
                    return address;
                }

                return resolveByServer(parts.path).then(path => {
                    if(path) {
                        parts.path = path;
                        address = buildUrl(parts);
                    }

                    return address;
                });
            });
        }
    });

    function resolveByServer(path) {
        return fetch("systemjs/locate?path=" + path)
            .then(res => res.json())
            .then(json => {
                if(json.err) {
                    json.path = path;
                }

                return json.path;
            })
            .catch(err => {
                console.error(err);
            });
    }

    function buildUrl(parts) {
        let url = "";

        if(parts.base) {
            url = parts.base;
        }

        url += parts.path;

        if(parts.plugin) {
            url += ("!" + parts.plugin);
        }

        return url;
    }

    function parseUrl(url) {
        var res = {
            base: undefined,
            path: undefined,
            plugin: undefined,
        };

        let index = url.indexOf("//");
        if (index == -1) {
            return null;
        }

        index = url.indexOf("/", index + 2);
        if (index == -1) {
            return null;
        }

        let end = url.indexOf("!", index+1);
        if(end == -1) {
            end = undefined;
        }

        res.base = url.substring(0, index + 1);
        res.path = url.substring(index + 1, end);
        res.plugin = (end ? url.substring(end + 1) : undefined);
        return res;
    }

    function hook(obj, methodName, factory) {
        const oldMethod = obj[methodName];

        obj[methodName] = factory(oldMethod);
    }
})();
