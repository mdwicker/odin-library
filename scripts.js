// Setup Materials
const booksToAdd = [
    ["The Hobbit", "J.R.R. Tolkien", 295, true],
    ["The Discarded Image", "C.S. Lewis", 300, true],
    ["All Hallows' Eve", "Charles Williams", 200, false]
];

// Library class
class Library {
    #books = [];

    constructor(books = []) {
        books.forEach(book => this.addBook(...book));
    };

    addBook(title, author, pages, read) {
        const book = new Book(title, author, pages, read);
        this.#books.push(book);
        return book;
    }

    getBook(id) {
        return this.#books.find((book) => book.id === id);
    }

    getAllBooks() {
        return [...this.#books];
    }

    deleteBook(id) {
        const index = this.#books.findIndex(book => book.id === id);
        if (index > -1) {
            this.#books.splice(index, 1);
        }
    }
}



// Book class

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.id = self.crypto.randomUUID();
    }

    info() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read' : 'unread'}`;
    }

    toggleRead() {
        this.read = !this.read;
    }
}


// Display module
const DisplayController = ((library) => {
    const container = document.querySelector(".book-cards");
    const bookNodes = {};

    renderShelf();


    function createBookNode(book) {
        const bookNode = document.createElement("div");
        bookNode.classList.add("book");
        bookNode.dataset.bookId = book.id;

        // Add components
        bookNode.append(
            createTitleNode(book.title),
            createAuthorNode(book.author),
            createReadMarkerNode(),
            createPageCountNode(book.pages),
            createDeleteBtn(book),
            createReadToggleBtn(book),
        );

        return bookNode;

        function createTitleNode(title) {
            const titleNode = document.createElement("div");
            titleNode.classList.add("book-title");
            titleNode.textContent = title;
            return titleNode;
        }

        function createAuthorNode(author) {
            const authorNode = document.createElement("div");
            authorNode.classList.add("book-author");
            authorNode.textContent = author;
            return authorNode;
        }

        function createReadMarkerNode() {
            const readMarkerNode = document.createElement("button");
            readMarkerNode.classList.add("book-read-marker");
            readMarkerNode.textContent = '✓';
            return readMarkerNode;
        }

        function createPageCountNode(pages) {
            const pageCountNode = document.createElement("div");
            pageCountNode.classList.add("book-pages");
            pageCountNode.textContent = pages ? `${pages}p` : '';
            return pageCountNode;
        }

        function createDeleteBtn() {
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("book-delete-btn");
            deleteBtn.classList.add("book-hidden-btn");
            deleteBtn.textContent = 'Delete';
            return deleteBtn;
        }

        function createReadToggleBtn() {
            const readToggleBtn = document.createElement("button");
            readToggleBtn.classList.add("book-read-toggle");
            readToggleBtn.classList.add("book-hidden-btn");
            return readToggleBtn;
        }
    }

    function refreshBook(id) {
        const book = library.getBook(id);
        const bookNode = bookNodes[id];

        if (!book || !bookNode) {
            return;
        }

        const readMarker = bookNode.querySelector(".book-read-marker");
        const readToggle = bookNode.querySelector(".book-read-toggle");

        readMarker.classList.toggle("is-read", book.read);
        readMarker.classList.toggle("is-unread", !book.read);

        readToggle.textContent = book.read ? "Mark Unread" : "Mark Read";
    }

    function renderShelf() {
        const books = library.getAllBooks();

        for (const id in bookNodes) {
            if (!books.find(book => book.id === id)) {
                bookNodes[id].remove();
                delete bookNodes[id];
            }
        }
        for (const book of books) {
            if (!(book.id in bookNodes)) {
                bookNodes[book.id] = createBookNode(book);
                container.append(bookNodes[book.id]);
            } else {
                refreshBook(book.id);
            }
        }
    }

})(new Library(booksToAdd));



// Page Initialization 

// const bookCards = document.querySelector(".book-cards");
// const myLibrary = new Library(booksToAdd);

// for (const book of myLibrary.getAllBooks()) {
//     bookCards.append(createBookDomElement(book))
// }


// Event Listener Wiring// Wiring

function toggleReadStatus(bookId) {
    const bookNode = document.querySelector(`.book[data-book-id="${bookId}"]`);
    renderBook(bookNode, book);
}


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

    const book = myLibrary.addBook(
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
