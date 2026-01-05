const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  (async () => {
    const response = await axios.get(`${getBaseUrl(req)}/internal/books`);
    return res.status(200).json(response.data);
  })().catch(() => res.status(500).json({ message: "Error retrieving books" }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  axios
    .get(`${getBaseUrl(req)}/internal/isbn/${isbn}`)
    .then((response) => res.status(200).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status === 404) {
        return res.status(404).json({ message: "Book not found" });
      }
      return res.status(500).json({ message: "Error retrieving book" });
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  (async () => {
    const author = req.params.author;
    const response = await axios.get(`${getBaseUrl(req)}/internal/author/${encodeURIComponent(author)}`);
    return res.status(200).json(response.data);
  })().catch(() => res.status(500).json({ message: "Error retrieving books" }));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  (async () => {
    const title = req.params.title;
    const response = await axios.get(`${getBaseUrl(req)}/internal/title/${encodeURIComponent(title)}`);
    return res.status(200).json(response.data);
  })().catch(() => res.status(500).json({ message: "Error retrieving books" }));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
