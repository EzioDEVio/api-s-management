
# Book Management API

This project demonstrates how to create a simple Book Management API using Node.js, Express, and MongoDB, along with a web interface built with HTML and Bootstrap to perform CRUD operations.

## Table of Contents

1. [Installation](#installation)
2. [Setup](#setup)
3. [Run the Server](#run-the-server)
4. [Web Interface](#web-interface)
5. [API Endpoints](#api-endpoints)
6. [Usage](#usage)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)

### Clone the Repository

```bash
git clone <repository-url>
cd book-management-api
```

### Install Dependencies

```bash
npm install
```

## Setup

### MongoDB

Ensure MongoDB is installed and running. By default, MongoDB stores data in `C:\data\db` on Windows. If this directory does not exist, create it:

```powershell
mkdir C:\data
mkdir C:\data\db
```

Start MongoDB:

```powershell
mongod
```

### Project Structure

```
book-management-api/
│
├── models/
│   └── Book.js
│
├── public/
│   └── index.html
│
├── routes/
│   └── bookRoutes.js
│
├── server.js
├── package.json
└── README.md
```

### Code

#### server.js

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from the "public" directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookdb', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Use book routes
app.use('/api', bookRoutes);

// Define a simple route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
```

#### models/Book.js

```javascript
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    published_date: Date,
    pages: Number,
    language: String,
});

module.exports = mongoose.model('Book', bookSchema);
```

#### routes/bookRoutes.js

```javascript
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
        await res.book.remove();
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
```

#### public/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book API</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h1 class="mt-5">Book Management</h1>

        <!-- Add New Book Form -->
        <div class="card mt-3 mb-3">
            <div class="card-body">
                <h5 class="card-title">Add a New Book</h5>
                <form id="bookForm">
                    <div class="form-group">
                        <label for="title">Title</label>
                        <input type="text" class="form-control" id="title" required>
                    </div>
                    <div class="form-group">
                        <label for="author">Author</label>
                        <input type="text" class="form-control" id="author" required>
                    </div>
                    <div class="form-group">
                        <label for="published_date">Published Date</label>
                        <input type="date" class="form-control" id="published_date" required>
                    </div>
                    <div class="form-group">
                        <label for="pages">Pages</label>
                        <input type="number" class="form-control" id="pages" required>
                    </div>
                    <div class="form-group">
                        <label for="language">Language</label>
                        <input type="text" class="form-control" id="language" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Book</button>
                </form>
            </div>
        </div>

        <!-- Search Bar -->
        <div class="card mt-3 mb-3">
            <div class="card-body">
                <h5 class="card-title">Search Books</h5>
                <input type="text" class="form-control" id="search" placeholder="Search by title or author">
            </div>
        </div>

        <!-- Books List -->
        <h2 class="mt-5">Books List</h2>
        <ul id="booksList" class="list-group"></ul>
    </div>

    <!-- Update Book Modal -->
    <div class="modal fade" id="updateBookModal" tabindex="-1" role="dialog" aria-labelledby="updateBookModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="updateBookModalLabel">Update Book</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="updateBookForm">
                        <input type="hidden" id="updateBookId">
                        <div class="form-group">
                            <label for="updateTitle">Title</label>
                            <input type="text" class="form-control" id="updateTitle" required>
                        </div>
                        <div class="form-group">
                            <label for="updateAuthor">Author</label>
                            <input type="text" class="form-control" id="updateAuthor" required>
                        </div>
                        <div class="form-group">
                            <label for="updatePublishedDate">Published Date</label>
                            <input type="date" class="form-control" id="updatePublishedDate" required>
                        </div>
                        <div class="form-group">
                            <label for="updatePages">Pages</label>
                            <input type="number"

 class="form-control" id="updatePages" required>
                        </div>
                        <div class="form-group">
                            <label for="updateLanguage">Language</label>
                            <input type="text" class="form-control" id="updateLanguage" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Update Book</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>
    <script>
        $(document).ready(function() {
            function loadBooks(query = '') {
                $.get('/api/books', function(data) {
                    $('#booksList').empty();
                    const filteredBooks = data.filter(book => book.title.toLowerCase().includes(query.toLowerCase()) || book.author.toLowerCase().includes(query.toLowerCase()));
                    filteredBooks.forEach(function(book) {
                        $('#booksList').append(`
                            <li class="list-group-item">
                                ${book.title} by ${book.author}
                                <button class="btn btn-sm btn-warning float-right ml-2" onclick="editBook('${book._id}')">Edit</button>
                                <button class="btn btn-sm btn-danger float-right" onclick="deleteBook('${book._id}')">Delete</button>
                            </li>
                        `);
                    });
                });
            }

            $('#bookForm').submit(function(event) {
                event.preventDefault();
                const book = {
                    title: $('#title').val(),
                    author: $('#author').val(),
                    published_date: $('#published_date').val(),
                    pages: $('#pages').val(),
                    language: $('#language').val(),
                };

                $.ajax({
                    url: '/api/books',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(book),
                    success: function() {
                        loadBooks();
                        $('#bookForm')[0].reset();
                    }
                });
            });

            $('#updateBookForm').submit(function(event) {
                event.preventDefault();
                const bookId = $('#updateBookId').val();
                const updatedBook = {
                    title: $('#updateTitle').val(),
                    author: $('#updateAuthor').val(),
                    published_date: $('#updatePublishedDate').val(),
                    pages: $('#updatePages').val(),
                    language: $('#updateLanguage').val(),
                };

                $.ajax({
                    url: '/api/books/' + bookId,
                    type: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify(updatedBook),
                    success: function() {
                        loadBooks();
                        $('#updateBookModal').modal('hide');
                    }
                });
            });

            window.editBook = function(id) {
                $.get('/api/books/' + id, function(book) {
                    $('#updateBookId').val(book._id);
                    $('#updateTitle').val(book.title);
                    $('#updateAuthor').val(book.author);
                    $('#updatePublishedDate').val(book.published_date);
                    $('#updatePages').val(book.pages);
                    $('#updateLanguage').val(book.language);
                    $('#updateBookModal').modal('show');
                });
            };

            window.deleteBook = function(id) {
                $.ajax({
                    url: '/api/books/' + id,
                    type: 'DELETE',
                    success: function() {
                        loadBooks();
                    }
                });
            };

            $('#search').on('input', function() {
                const query = $(this).val();
                loadBooks(query);
            });

            loadBooks();
        });
    </script>
</body>
</html>
```

## Run the Server

To run the server, navigate to your project directory and start the server:

```bash
node server.js
```

## Web Interface

Open your browser and navigate to `http://localhost:3000/`. You can now perform the following actions through the web interface:

- Add a new book
- Search books by title or author
- Edit an existing book
- Delete a book

## API Endpoints

### Get All Books

**GET** `/api/books`

### Get a Single Book

**GET** `/api/books/:id`

### Create a New Book

**POST** `/api/books`

Request body example:
```json
{
    "title": "Book Title",
    "author": "Author Name",
    "published_date": "2021-01-01",
    "pages": 200,
    "language": "English"
}
```

### Update a Book

**PATCH** `/api/books/:id`

Request body example:
```json
{
    "title": "Updated Title",
    "author": "Updated Author",
    "published_date": "2022-01-01",
    "pages": 300,
    "language": "Updated Language"
}
```

### Delete a Book

**DELETE** `/api/books/:id`

## Usage

1. **Add a Book**: Fill out the form and click "Add Book".
2. **Search for a Book**: Use the search bar to filter books by title or author.
3. **Edit a Book**: Click the "Edit" button next to a book, update the details, and save changes.
4. **Delete a Book**: Click the "Delete" button next to a book to remove it from the database.

By following these steps, you can create and manage books using the API and web interface. If you encounter any issues or have any questions, feel free to open an issue or contact the project maintainers.
```

This `README.md` file provides a comprehensive guide on how to set up and run the Book Management API, including installation steps, code examples, and instructions for using the web interface.