var re = /^(?:\.|\/|\\|[A-Z]:)/;
var fs = require("fs");

module.exports = function createRequireUpdated(require) {
    return function requireUpdated(filename) {
        var isThing = re.test(filename)

        if (isThing) {
            filename = require.resolve(filename)

            var inCache = (filename in require.cache)

            if (!inCache) {
                fs.watch(filename, function () {
                    this.close();
                    delete require.cache[filename]
                })
            }
        }

        return require(filename)
    };
}
