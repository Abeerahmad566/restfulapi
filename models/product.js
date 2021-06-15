var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { Schema } = mongoose;
const productSchema = new Schema({
  name: String,
  price: Number,
});
function validateProduct(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    price: Joi.number().min(0).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports = mongoose.model.Product || mongoose.model("Product", productSchema); 
