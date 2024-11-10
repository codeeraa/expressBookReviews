const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Simulate asynchronous operation for getting book list (Task 10)
public_users.get('/', async function (req, res) {
    try {
        const booksList = await getBooks();  // Simulate async call
        res.status(200).json(booksList);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books list" });
    }
});

// Simulate async operation to get book details based on ISBN (Task 11)
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = await getBookByISBN(isbn);  // Simulate async call
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ error: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching book details" });
    }
});

// Simulate async operation to get books by author (Task 12)
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();
    try {
        const booksByAuthor = await getBooksByAuthor(author);  // Simulate async call
        if (booksByAuthor.length > 0) {
            res.status(200).json(booksByAuthor);
        } else {
            res.status(404).json({ error: "No books found for this author" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching books by author" });
    }
});

// Simulate async operation to get book by title (Task 13)
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();
    try {
        const bookByTitle = await getBookByTitle(title);  // Simulate async call
        if (bookByTitle) {
            res.status(200).json(bookByTitle);
        } else {
            res.status(404).json({ error: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching book by title" });
    }
});

// Simulate async operation to get book reviews based on ISBN
public_users.get('/review/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const bookReviews = await getBookReviews(isbn);  // Simulate async call
        if (bookReviews) {
            res.status(200).json(bookReviews);
        } else {
            res.status(404).json({ error: "Reviews not found for this ISBN" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching book reviews" });
    }
});

// Simulate getting books (Task 10)
async function getBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);  // Simulate async behavior
        }, 1000);
    });
}

// Simulate getting book by ISBN (Task 11)
async function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) resolve(book);
            else reject('Book not found');
        }, 1000);
    });
}

// Simulate getting books by author (Task 12)
async function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = Object.values(books).filter(book => book.author.toLowerCase()
             === author);
            resolve(result);
        }, 1000);
    });
}

// Simulate getting book by title (Task 13)
async function getBookByTitle(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = Object.values(books).find(book => book.title.toLowerCase() 
            === title);
            if (book) resolve(book);
            else reject('Book not found');
        }, 1000);
    });
}

// Simulate getting book reviews based on ISBN
async function getBookReviews(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book && book.reviews) resolve(book.reviews);
            else reject('Reviews not found');
        }, 1000);
    });
}

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: "Username already exists" });
    }
    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully" });
});

module.exports.general = public_users;
