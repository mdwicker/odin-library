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

    toggleRead(id) {
        const book = this.getBook(id);
        if (book) {
            book.toggleRead();
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
const Display = ((library) => {
    const container = document.querySelector(".book-cards");
    const bookNodes = {};

    renderShelf();
    bindBookCardListeners();
    bindAddBookFormListeners();


    function bindBookCardListeners() {
        container.addEventListener('click', (e) => {
            const classes = e.target.classList;
            const card = e.target.closest(".book");
            if (!card) return;
            const id = card.dataset.bookId;

            if (classes.contains("book-delete-btn") &&
                window.confirm("Do you really want to delete this book?")) {
                library.deleteBook(id);
            } else if (classes.contains("book-read-toggle") ||
                classes.contains("book-read-marker")) {
                library.toggleRead(id);
            } else {
                return;
            }

            renderShelf();
        })
    }

    function bindAddBookFormListeners() {
        const dialog = document.querySelector(".add-book-dialog");
        const form = document.querySelector('.add-book-dialog form');

        // Open form when "add book" is pressed
        document.getElementById("add-book-btn")
            .addEventListener("click", () => {
                dialog.showModal();
            });

        // Close book form on cancel
        document.getElementById("add-book-cancel-btn")
            .addEventListener("click", () => {
                dialog.close();
            });

        // Reset book form on close
        dialog.addEventListener("close", () => {
            form.reset();
        });

        // Add book on form submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const bookData = new FormData(form);

            library.addBook(
                bookData.get("title"),
                bookData.get("author"),
                bookData.get("pages"),
                bookData.get("read") === "true");

            dialog.close();

            renderShelf();
        });
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
            }
            refreshBook(book.id);
        }
    }

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
            createDeleteBtn(),
            createReadToggleBtn(),
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

})(new Library(booksToAdd));