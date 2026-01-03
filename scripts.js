const myLibrary = [];

const booksToAdd = [
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        pages: 295,
        read: true
    },
    {
        title: "The Discarded Image",
        author: "C.S. Lewis",
        pages: 300,
        read: true
    },
    {
        title: "All Hallows' Eve",
        author: "Charles Williams",
        pages: 200,
        read: false
    }
];


function Book(title, author, pages, read) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = self.crypto.randomUUID();
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read' : 'unread'}`;
}

Book.prototype.toggleRead = function () {
    this.read = !this.read;
}

function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);

    myLibrary.push(newBook);
    return newBook;
}

function createBookDomElement(book) {
    const bookNode = document.createElement("div");
    bookNode.classList.add("book");
    bookNode.dataset.bookId = book.id;

    // Add components
    bookNode.append(
        createTitleNode(book),
        createAuthorNode(book),
        createReadMarkerNode(book),
        createPageCountNode(book),
        createDeleteBtn(book),
        createReadToggleBtn(book),
    );

    renderBook(bookNode, book);
    return bookNode;
}

function createTitleNode(book) {
    const titleNode = document.createElement("div");
    titleNode.classList.add("book-title");
    titleNode.textContent = book.title;
    return titleNode;
}

function createAuthorNode(book) {
    const authorNode = document.createElement("div");
    authorNode.classList.add("book-author");
    authorNode.textContent = book.author;
    return authorNode;
}

function createReadMarkerNode(book) {
    const readMarkerNode = document.createElement("button");
    readMarkerNode.classList.add("book-read-marker");
    readMarkerNode.textContent = '✓';
    readMarkerNode.dataset.bookId = book.id;
    return readMarkerNode;
}

function createPageCountNode(book) {
    const pageCountNode = document.createElement("div");
    pageCountNode.classList.add("book-pages");
    pageCountNode.textContent = book.pages ? `${book.pages}p` : '';
    return pageCountNode;
}

function createDeleteBtn(book) {
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("book-delete-btn");
    deleteBtn.classList.add("book-hidden-btn");
    deleteBtn.textContent = 'Delete';
    deleteBtn.dataset.bookId = book.id;
    return deleteBtn;
}

function createReadToggleBtn(book) {
    const readToggleBtn = document.createElement("button");
    readToggleBtn.classList.add("book-read-toggle");
    readToggleBtn.classList.add("book-hidden-btn");
    readToggleBtn.dataset.bookId = book.id;
    return readToggleBtn;
}

function deleteBook(bookId) {
    const index = myLibrary.findIndex(book => book.id === bookId);
    if (index > -1) {
        myLibrary.splice(index, 1);
        document.querySelector(`.book[data-book-id="${bookId}"]`).remove();
    }
}

function toggleReadStatus(bookId) {
    const book = myLibrary.find(book => book.id === bookId);
    const bookNode = document.querySelector(`.book[data-book-id="${bookId}"]`);

    book.toggleRead();
    renderBook(bookNode, book);
}

function renderBook(bookNode, book) {
    const readMarker = bookNode.querySelector(".book-read-marker");
    const readToggle = bookNode.querySelector(".book-read-toggle");

    readMarker.classList.toggle("is-read", book.read);
    readMarker.classList.toggle("is-unread", !book.read);

    readToggle.textContent = book.read ? "Mark Unread" : "Mark Read";
}


// Page Initialization 

const bookCards = document.querySelector(".book-cards");

for (const book of booksToAdd) {
    const newBook = addBookToLibrary(book.title, book.author, book.pages, book.read);
    bookCards.append(createBookDomElement(newBook))
}


// Event Listener Wiring

const addBookDialog = document.querySelector(".add-book-dialog");
const addBookForm = document.querySelector('.add-book-dialog form');

// Add Book button displays form
document.getElementById("add-book-btn").addEventListener("click", () => {
    addBookDialog.showModal();
});

// Close book form on cancel
document.getElementById("add-book-cancel-btn")
    .addEventListener("click", () => {
        addBookDialog.close();
    });

// Reset book form on close
addBookDialog.addEventListener("close", () => {
    addBookForm.reset();
});

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const bookData = new FormData(addBookForm);

    const book = addBookToLibrary(
        bookData.get("title"),
        bookData.get("author"),
        bookData.get("pages"),
        bookData.get("read") === "true");
    bookCards.append(createBookDomElement(book));

    addBookDialog.close();
});

// Event listeners for delete buttons and reat status toggles
document.querySelector(".book-cards").addEventListener('click', (e) => {
    const bookId = e.target.dataset.bookId;

    if (e.target.classList.contains("book-delete-btn")) {
        if (window.confirm("Do you really want to delete this book?")) {
            deleteBook(bookId);
        }
    }

    if (e.target.classList.contains("book-read-toggle")
        || e.target.classList.contains("book-read-marker")) {
        toggleReadStatus(bookId);
    }
})
