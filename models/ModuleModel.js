const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  type: String,
  fileUrl: String,
});

const ModuleSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  resources: {
    type: [ResourceSchema],
    default: undefined,
  },
  prerequisites: [String],
  releaseDate: Date,
});

const Module = mongoose.model('Module', ModuleSchema);

module.exports = Module;