const mongoose = require('mongoose');

const electronicsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    specs: { type: String, required: true },
    imageUrl: { type: String }
});

module.exports = mongoose.model('Electronics', electronicsSchema);
