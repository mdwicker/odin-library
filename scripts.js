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
        throw Error("You must use the 'new' operator to call the constructur");
    }

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = self.crypto.randomUUID();

    this.info = function () {
        return `${title} by ${author}, ${pages} pages, ${read ? 'read' : 'not read yet'}`;
    }
}

function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);

    myLibrary.push(newBook);
}

function createBookDomElement(book) {
    const bookNode = document.createElement("div");
    bookNode.classList.add("book");
    bookNode.id = book.id;

    const bookTitle = document.createElement("div");
    bookTitle.classList.add("book-title");
    bookTitle.textContent = book.title;
    bookNode.append(bookTitle);

    const bookAuthor = document.createElement("div");
    bookAuthor.classList.add("book-author");
    bookAuthor.textContent = book.author;
    bookNode.append(bookAuthor);

    const bookRead = document.createElement("div");
    bookRead.classList.add("book-read");
    bookRead.textContent = '✓';
    if (!book.read) {
        bookRead.classList.add("hidden");
    }
    bookNode.append(bookRead);

    const bookPages = document.createElement("div");
    bookPages.classList.add("book-pages");
    bookPages.textContent = book.pages;
    bookNode.append(bookPages);

    return bookNode;
}


// Page Initialization 

const bookCards = document.querySelector(".book-cards");

for (const book of booksToAdd) {
    addBookToLibrary(book.title, book.author, book.pages, book.read);
}

for (const book of myLibrary) {
    bookCards.append(createBookDomElement(book));
}



// Event Listeners
const addBookDialog = document.getElementById("add-book-dialog");

document.getElementById("add-book-btn").addEventListener("click", () => {
    addBookDialog.showModal();
});

document.getElementById("add-book-save-btn")
    .addEventListener("click", (e) => {
        // Avoid submitting form
        e.preventDefault();
        addBookDialog.close();

        // get data from form
        // make new book
        // add to dom
        // reset form
    });
