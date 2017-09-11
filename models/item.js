var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        'default': 0
    }
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;
