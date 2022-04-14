const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength:1, maxlength:25},
    description: {type: String, required: true, minlength:1},
    category: {type: String, required: true, minlength:1, maxlength:25},
    price: {type: Number, required: true},
    dateAdded: {type: Date, default: Date.now()},
});

function validateProduct(product){
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        description: Joi.string().required(),
        category: Joi.string().min(2).max(255).required(),
        price: Joi.number().required()
    })
    return schema.validate(product);
}


const Product = mongoose.model('Product', productSchema);

module.exports = {
    Product,
    validateProduct,
    productSchema,
}; 
 82  
routes/comments.js
const {Product, validateProduct} = require("../models/product");
const express = require("express");
const router = express.Router();

//Get products(ALL)
router.get("/", async (req, res) => {
    try {
        let products = await Product.find();
        if (!products) return res.status(400).send(`No products in this collection!`);
        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//ID product
router.get("/:productId", async (req,res) => {
    try {
        let product = await Product.findById(req.params.productId)
        if (!product)
            return res.status(400).send(`Product with Id of ${req.params.productId} does not exist!`);
        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
})

//Post product
router.post("/", async (req, res) => {
    try {
        const {error} = validateProduct(req.body)
        if (error) return res.status(400).send(error);

        let newProduct = await new Product(req.body)
        await newProduct.save()

        return res.status(201).send(newProduct)
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//Input products
router.put("/:productId", async (req,res) => {
    try {
        const {error} = validateProduct(req.body)
        if (error) return res.status(400).send(error);

        let product = await Product.findByIdAndUpdate(req.params.productId, req.body, {new: true});
        if (!product)
        return res.status(400).send(`Product with Id of ${req.params.productId} does not exist!`);

        return res.send(product);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
})

//Erase products
router.delete("/:productId", async (req, res) => {
    try {
        let product = await Product.findByIdAndDelete(req.params.productId);
        if (!product)
            return res.status(400).send(`Product with Id of ${req.params.productId} does not exist!`);
        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);   
    }
});





module.exports = router; 