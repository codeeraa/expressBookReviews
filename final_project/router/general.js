const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.status(200).json(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const result = Object.values(books).filter(book => book.author.toLowerCase() === author);
    if (result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ error: "No books found for this author" });
    }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const result = Object.values(books).find(book => book.title.toLowerCase() === title);
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ error: "No books found with this title" });
    }
});


// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ error: "Reviews not found for this ISBN" });
    }
});

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    if (users[username]) {
        return res.status(400).json({ error: "Username already exists" });
    }
    users[username] = { username, password };
    res.status(201).json({ message: "User registered successfully" });
});

module.exports.general = public_users;
