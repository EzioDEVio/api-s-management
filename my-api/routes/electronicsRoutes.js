const express = require('express');
const router = express.Router();
const Electronics = require('../models/Electronics');

// Get all electronics
router.get('/electronics', async (req, res) => {
    try {
        const electronics = await Electronics.find();
        res.json(electronics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single electronics item
router.get('/electronics/:id', getElectronics, (req, res) => {
    res.json(res.electronics);
});

// Create a new electronics item
router.post('/electronics', async (req, res) => {
    const electronics = new Electronics({
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        specs: req.body.specs,
        imageUrl: req.body.imageUrl
    });

    try {
        const newElectronics = await electronics.save();
        res.status(201).json(newElectronics);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an electronics item
router.patch('/electronics/:id', getElectronics, async (req, res) => {
    if (req.body.name != null) {
        res.electronics.name = req.body.name;
    }
    if (req.body.brand != null) {
        res.electronics.brand = req.body.brand;
    }
    if (req.body.price != null) {
        res.electronics.price = req.body.price;
    }
    if (req.body.specs != null) {
        res.electronics.specs = req.body.specs;
    }
    if (req.body.imageUrl != null) {
        res.electronics.imageUrl = req.body.imageUrl;
    }

    try {
        const updatedElectronics = await res.electronics.save();
        res.json(updatedElectronics);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an electronics item
router.delete('/electronics/:id', async (req, res) => {
    try {
        await Electronics.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Electronics' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get electronics by ID
async function getElectronics(req, res, next) {
    let electronics;
    try {
        electronics = await Electronics.findById(req.params.id);
        if (electronics == null) {
            return res.status(404).json({ message: 'Cannot find electronics' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.electronics = electronics;
    next();
}

module.exports = router;
