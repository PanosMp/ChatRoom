/**
 * Cache module
 */
const cache = require('memory-cache');

/**
 * Wrap the memory cache module functions we need so we can move to 
 * another cache if needed
 */
module.exports = {
    // add item to cache
    push: (key, value) => cache.put(key, value),
    // add item that disappears after x ms and execute the given cb
    pushUntil: (key, value, ms, cb) => cache.put(key, value, ms, cb),
    // get value for key
    get: (key) => cache.get(key),
    // remove entry from cache based on the key
    remove: (key) => cache.del(key),
    // clear cache
    clear: () =>  cache.clear(),
    // update cache entry, 
    update: (key, newValue) => {
        cache.del(key);
        cache.put(key, newValue);
    },
};