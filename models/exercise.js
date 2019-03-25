const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, required: true},
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: {type: String, required: true}  
}, {timestamps: true});

const ModelClass = mongoose.model("Exercise", exerciseSchema);

module.exports = ModelClass;