const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    specs: { type: String, required: true },
    imageUrl: { type: String }
});

module.exports = mongoose.model('Laptop', laptopSchema);
