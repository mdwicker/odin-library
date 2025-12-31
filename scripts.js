const myLibrary = [
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

    this.info = function () {
        return `${title} by ${author}, ${pages} pages, ${read ? 'read' : 'not read yet'}`
    }
}

function addBookToLibrary(title, author, pages, read) {

}
