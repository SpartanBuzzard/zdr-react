const router = require('express').Router();
let Product = require('../models/product.model');

router.route('/').get((req, res) => { //Fetches all products by default

    Product.find()
        .then(products => res.json({found: true, products: products}))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/pagination/:start/:limit').get((req, res) => { 
    const {start, limit} = req.params


    Product.find().skip(parseInt(start)).limit(parseInt(limit)).sort({name: 1})
        .then(products => res.json({found: true, products: products}))
        .catch(err => res.status(400).json('Error in Pagination Request: ' + err));
});

router.route('/add').post((req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const price = Number(req.body.price);
    const image = req.body.image;

    const newProduct = new Product({
        name,
        description,
        price,
        image,
        calories,
        protein,
        weight, 
        volume,
        nutrition: {}
    });

    newProduct.save()
        .then(() => res.json('Product added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

//Used for uploading the old SQL database to MongoDB.... will need for each table in old DB
router.route('/upload-json').get((req, res, next) => { 
    let products = require('../../src/zdr_products.json');

    products.forEach((p, index) => {
        //Create a new product and add it to the products collection

            const name = p.name
            const description = p.description
            const price = p.price
            const imageURL = p.image
            const calories = p.calories
            const caloric_density = p.caloric_density
            const calorie_cost = p.calorie_cost
            const unit_cost = p.unit_cost
            const supplier = p.supplier
            const protein = p.protein
            const weight = p.weight
            const volume = p.volume
            const nutrition = {}
            const stock = p.stock
            const threshold = p.threshold

            const newProduct = new Product({
                name,
                description,
                price,
                imageURL,
                calories,
                caloric_density,
                calorie_cost,
                unit_cost,
                supplier,
                protein,
                weight, 
                volume,
                nutrition,
                stock,
                threshold,
            });

            newProduct.save()
    })
    next()
})

router.route('/:id').get((req, res) => {
    Product.findById(req.params.id)
        .then(product => res.json(product))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(() => res.json('Product deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            product.username = req.body.username;
            product.description = req.body.description;
            product.duration = Number(req.body.duration);
            product.date = Date.parse(req.body.date);

            product.save()
                .then(() => res.json('Product update!'))
                .catch(err => res.status(400).json('Error: ' + errr));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;