const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(express.static("public")); // Serve your static files (HTML, CSS, JS)

let books = []; // Temporary in-memory database for books

// GET all books
app.get("/api/books", (req, res) => {
  res.json(books);
});

// GET books by title (for search)
app.get("/api/books/search", (req, res) => {
  const searchTitle = req.query.title.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );
  res.json(filteredBooks);
});

// POST a new book
app.post("/api/books", (req, res) => {
  const { title, author, genre } = req.body;
  const newBook = { id: Date.now(), title, author, genre };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT to update a book
app.put("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author, genre } = req.body;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex] = { id: bookId, title, author, genre };
    res.json(books[bookIndex]);
  } else {
    res.status(404).send("Book not found");
  }
});

// DELETE a book
app.delete("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    res.status(200).send("Book deleted");
  } else {
    res.status(404).send("Book not found");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
