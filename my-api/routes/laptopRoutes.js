const express = require('express');
const router = express.Router();
const Laptop = require('../models/Laptop');

// Get all laptops
router.get('/laptops', async (req, res) => {
    try {
        const laptops = await Laptop.find();
        res.json(laptops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single laptop
router.get('/laptops/:id', getLaptop, (req, res) => {
    res.json(res.laptop);
});

// Create a new laptop
router.post('/laptops', async (req, res) => {
    const laptop = new Laptop({
        brand: req.body.brand,
        model: req.body.model,
        price: req.body.price,
        specs: req.body.specs,
        imageUrl: req.body.imageUrl
    });

    try {
        const newLaptop = await laptop.save();
        res.status(201).json(newLaptop);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a laptop
router.patch('/laptops/:id', getLaptop, async (req, res) => {
    if (req.body.brand != null) {
        res.laptop.brand = req.body.brand;
    }
    if (req.body.model != null) {
        res.laptop.model = req.body.model;
    }
    if (req.body.price != null) {
        res.laptop.price = req.body.price;
    }
    if (req.body.specs != null) {
        res.laptop.specs = req.body.specs;
    }
    if (req.body.imageUrl != null) {
        res.laptop.imageUrl = req.body.imageUrl;
    }

    try {
        const updatedLaptop = await res.laptop.save();
        res.json(updatedLaptop);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a laptop
router.delete('/laptops/:id', async (req, res) => {
    try {
        await Laptop.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Laptop' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get laptop by ID
async function getLaptop(req, res, next) {
    let laptop;
    try {
        laptop = await Laptop.findById(req.params.id);
        if (laptop == null) {
            return res.status(404).json({ message: 'Cannot find laptop' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.laptop = laptop;
    next();
}

module.exports = router;
