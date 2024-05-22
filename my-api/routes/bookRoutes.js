const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single book
router.get('/books/:id', getBook, (req, res) => {
    res.json(res.book);
});

// Create a new book
router.post('/books', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        published_date: req.body.published_date,
        pages: req.body.pages,
        language: req.body.language,
        category: req.body.category,
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a book
router.patch('/books/:id', getBook, async (req, res) => {
    if (req.body.title != null) {
        res.book.title = req.body.title;
    }
    if (req.body.author != null) {
        res.book.author = req.body.author;
    }
    if (req.body.published_date != null) {
        res.book.published_date = req.body.published_date;
    }
    if (req.body.pages != null) {
        res.book.pages = req.body.pages;
    }
    if (req.body.language != null) {
        res.book.language = req.body.language;
    }
    if (req.body.category != null) {
        res.book.category = req.body.category;
    }

    try {
        const updatedBook = await res.book.save();
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a book
router.delete('/books/:id', getBook, async (req, res) => {
    try {
        await Book.deleteOne({ _id: res.book._id });
        res.json({ message: 'Deleted Book' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get book by ID
async function getBook(req, res, next) {
    let book;
    try {
        book = await Book.findById(req.params.id);
        if (book == null) {
            return res.status(404).json({ message: 'Cannot find book' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.book = book;
    next();
}

module.exports = router;
