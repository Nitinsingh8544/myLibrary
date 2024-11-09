// Global variable to store the ID of the book to be updated (if applicable)
let editingBookId = null;

// Handle Add Book Form Submission
document.getElementById('addBookForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const genre = document.getElementById('bookGenre').value;

    // Basic validation
    if (!title || !author || !genre) {
        displayMessage('All fields are required!', 'error');
        return;
    }

    showLoading(true);  // Show loading indicator

    if (editingBookId) {
        // If editingBookId is set, we are updating an existing book
        fetch(`/api/books/${editingBookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, author, genre })
        })
            .then(response => response.json())
            .then(data => {
                displayMessage('Book updated successfully!', 'success');
                resetForm();  // Clear the form after updating
                fetchBooks();  // Refresh the books list
            })
            .catch(error => {
                displayMessage('Error updating book.', 'error');
                console.error('Error updating book:', error);
            })
            .finally(() => showLoading(false));
    } else {
        // If no editingBookId, we are adding a new book
        fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, author, genre })
        })
            .then(response => response.json())
            .then(data => {
                displayMessage('Book added successfully!', 'success');
                resetForm();  // Clear the form after adding
                fetchBooks();  // Refresh the books list
            })
            .catch(error => {
                displayMessage('Error adding book.', 'error');
                console.error('Error adding book:', error);
            })
            .finally(() => showLoading(false));
    }
});

// Function to reset the form after adding or updating a book
function resetForm() {
    document.getElementById('addBookForm').reset();
    editingBookId = null;  // Clear the editingBookId
}

// Function to display messages (success or error)
function displayMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = `message ${type}`;
    setTimeout(() => messageBox.textContent = '', 3000); // Clear message after 3 seconds
}

// Function to show/hide loading spinner
function showLoading(isLoading) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (isLoading) {
        loadingIndicator.style.display = 'block';  // Show loading indicator
    } else {
        loadingIndicator.style.display = 'none';  // Hide loading indicator
    }
}

// Handle Search Book Form Submission
document.getElementById('searchBookForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('searchTitle').value;

    // Send GET request to search for books by title
    fetch(`/api/books/search?title=${title}`)
        .then(response => response.json())
        .then(data => {
            displayBooks(data);
        })
        .catch(error => {
            displayMessage('Error searching books.', 'error');
            console.error('Error searching books:', error);
        });
});

// Function to display a list of books
function displayBooks(books) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (books.length > 0) {
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-item';

            bookElement.innerHTML = `
                <p><strong>${book.title}</strong> by ${book.author} (Genre: ${book.genre})</p>
                <button class="edit-btn" onclick="editBook('${book._id}', '${book.title}', '${book.author}', '${book.genre}')">Edit</button>
                <button class="delete-btn" onclick="deleteBook('${book._id}')">Delete</button>
            `;
            resultsDiv.appendChild(bookElement);
        });
    } else {
        resultsDiv.innerHTML = 'No books found.';
    }
}

// Function to edit a book (populate form for editing)
function editBook(id, title, author, genre) {
    editingBookId = id;
    document.getElementById('bookTitle').value = title;
    document.getElementById('bookAuthor').value = author;
    document.getElementById('bookGenre').value = genre;
}

// Function to delete a book
function deleteBook(id) {
    const confirmDelete = confirm('Are you sure you want to delete this book?');

    if (confirmDelete) {
        fetch(`/api/books/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                displayMessage('Book deleted successfully!', 'success');
                fetchBooks();  // Refresh the books list
            })
            .catch(error => {
                displayMessage('Error deleting book.', 'error');
                console.error('Error deleting book:', error);
            });
    }
}

// Function to fetch all books and display them
function fetchBooks() {
    fetch('/api/books')
        .then(response => response.json())
        .then(data => {
            displayBooks(data);
        })
        .catch(error => {
            displayMessage('Error fetching books.', 'error');
            console.error('Error fetching books:', error);
        });
}

// Fetch books on page load
document.addEventListener('DOMContentLoaded', function () {
    fetchBooks();
});
