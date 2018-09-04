module.exports = function(db) {
  return {
    "Issues": require("./issues")(db)
  }
}