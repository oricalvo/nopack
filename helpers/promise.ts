//
//  Returns the first truthy resolved value
//
export function or(factories) {
    return new Promise(function (resolve, reject) {
        let index = 0;

        function next() {
            if (++index == factories.length) {
                resolve(false);
            }
            else {
                run();
            }
        }

        function run() {
            let promise = factories[index]();
            promise.then(function (val) {
                if(val) {
                    resolve(val);
                }
                else {
                    next();
                }
            }).catch(function (err) {
                reject(err);
            });
        }

        run();
    });
}

Promise.prototype["finally"] = function (callback) {
    let p = this.constructor;
    // We don’t invoke the callback in here,
    // because we want then() to handle its exceptions
    return this.then(
        // Callback fulfills: pass on predecessor settlement
        // Callback rejects: pass on rejection (=omit 2nd arg.)
        value  => p.resolve(callback()).then(() => value),
        reason => p.resolve(callback()).then(() => { throw reason })
    );
};

// export interface Promise<T> {
//     finally(): Promise<T>;
// }
