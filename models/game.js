var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GameSchema = new Schema({
  title: String,
  urlgog: String,
  urlsteam: String,
  developer: String,
  publisher: String,
  releasedate: String,
  discountpricegog: String,
  discountpricesteam: String,
  pricegog: String,
  pricesteam: String,
  rating: String,
});

var Game = mongoose.model("Game", GameSchema);
module.exports = Game;