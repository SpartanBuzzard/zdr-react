const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    imageURL: {type: String, required: true},
    calories: {type: Number},
    caloric_density: {type: Number},
    calorie_cost: {type: Number},
    unit_cost: {type: Number},
    supplier: {type: String},
    protein: {type: Number},
    weight: {type: Number},
    volume: {type: Number},
    nutrition: {type: Object},
    stock: {type: Number},
    threshold: {type: Number},
    active: {type: Boolean}
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;