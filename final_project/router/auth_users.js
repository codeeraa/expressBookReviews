const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const bookReviews = {};

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
  
    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });
  
    return res.status(200).json({ message: "Login successful", token });
  });
  
// Route to add or modify review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.user.username; // Retrieved from the decoded JWT token
  
    if (!bookReviews[isbn]) {
      bookReviews[isbn] = { reviews: [] };
    }
  
    const userReviewIndex = bookReviews[isbn].reviews.findIndex(r => r.username === username);
  
    if (userReviewIndex > -1) {
      // Update existing review
      bookReviews[isbn].reviews[userReviewIndex].review = review;
    } else {
      // Add new review
      bookReviews[isbn].reviews.push({ username, review });
    }
  
    res.status(200).json({ message: "Review added/updated successfully", bookReviews: bookReviews[isbn] });
  });

// Route to get reviews for a specific book (by ISBN)
regd_users.get("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    
    // Check if reviews exist for the given ISBN
    if (bookReviews[isbn]) {
      res.status(200).json({ reviews: bookReviews[isbn].reviews });
    } else {
      res.status(404).json({ message: "No reviews found for this book" });
    }
  });
  
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;  // Get ISBN from request params
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from headers
    
    if (!token) {
        return res.status(403).json({ message: "Token is required for authentication" });
    }
    
    // Decode the token to get the username
    try {
        const decoded = jwt.verify(token, "fingerprint_customer");
        const username = decoded.username;

        // Check if the book exists in the reviews collection
        if (bookReviews[isbn]) {
            // Check if the user has reviewed the book
            const userReviewIndex = bookReviews[isbn].reviews.findIndex(r => r.username === username);
            
            if (userReviewIndex > -1) {
                // Delete the user's review
                bookReviews[isbn].reviews.splice(userReviewIndex, 1);
                return res.status(200).json({ message: "Review deleted successfully" });
            } else {
                return res.status(404).json({ message: "No review found for this user on this book" });
            }
        } else {
            return res.status(404).json({ message: "Book not found or no reviews available" });
        }
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
