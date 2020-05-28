const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/rpgi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
mongoose.Promise = global.Promise;

module.exports = mongoose;