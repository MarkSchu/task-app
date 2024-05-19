const mongoose = require('mongoose');
const { Schema } = mongoose;

const tag = new Schema({
    title: String,
    userId: String,
    creationDate: String
});

const item = new Schema({
    type: String,
    title: String,
    tag: String,
    userId: String,
    creationDate: String
});

module.exports = {
    'tags': mongoose.model('tag', tag),
    'items': mongoose.model('item', item),
}

 