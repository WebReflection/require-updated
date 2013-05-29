function(re, fs){
  // (C) WebReflection - Mit Style License
  function watcher(
    /* event, filename */
  ) {
    this.close();
    delete require.cache[this.filename];
  }
  return function requireUpdated(filename) {
    return re.test(filename) && (
      (filename = require.resolve(filename)) in require.cache ||
      (fs.watch(filename, watcher).filename = filename)
    ), require(filename);
  };
}(
  /^(?:\.|\/|\\|[A-Z]:)/,
  require('fs')
)