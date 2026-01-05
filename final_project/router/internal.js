const express = require('express');
let books = require('./booksdb.js');

const internal = express.Router();

// Internal data endpoints used by public routes via Axios (Task 11)
internal.get('/books', (req, res) => {
  return res.status(200).json(books);
});

internal.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  return res.status(200).json(book);
});

internal.get('/author/:author', (req, res) => {
  const author = (req.params.author || '').toLowerCase();
  const matches = Object.keys(books)
    .filter((isbn) => (books[isbn].author || '').toLowerCase().includes(author))
    .reduce((result, isbn) => {
      result[isbn] = books[isbn];
      return result;
    }, {});

  return res.status(200).json(matches);
});

internal.get('/title/:title', (req, res) => {
  const title = (req.params.title || '').toLowerCase();
  const matches = Object.keys(books)
    .filter((isbn) => (books[isbn].title || '').toLowerCase().includes(title))
    .reduce((result, isbn) => {
      result[isbn] = books[isbn];
      return result;
    }, {});

  return res.status(200).json(matches);
});

module.exports.internal = internal;
