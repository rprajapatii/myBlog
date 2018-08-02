const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String, required: true, unique: true, uppercase: true
    }
});

module.exports = mongoose.model('Category',categorySchema);