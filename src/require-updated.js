function(re, fs, path){
  // (C) WebReflection - Mit Style License
  function watcher(
    /* event, filename */
  ) {
    this.close();
    delete require.cache[this.filename];
  }
  var dirName = path.dirname(module.parent.filename);
  return function requireUpdated(filename) {
    return re.test(filename) && (
      (filename = require.resolve(
        path.resolve(dirName, filename))
      ) in require.cache ||
      (fs.watch(filename, watcher).filename = filename)
    ), require(filename);
  };
}(
  /^(?:\.|\/|\\|[A-Z]:)/,
  require('fs'),
  require('path')
)