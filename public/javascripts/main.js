let books = [];
let book = [];
let tabBooks = document.getElementById('tab-books');
let str = ' ';
let stock = ' ';
let expired = 'Expires';
addButton = document.querySelector('#add');
sortStockButton = document.querySelector('#sort-stock');
sortExpireButton = document.querySelector('#sort-expire');
deleteButton = document.querySelector('#delete');


addButton.addEventListener('click', addBook,true);
sortStockButton.addEventListener('click',sortByStock, true);
sortExpireButton.addEventListener('click',sortByExpire, true);

render();

// Отображение книг

function render(){
    str = '';
    books = [];
    fetch('http://localhost:3000/getData')
        .then( res => { return res.json()})
        .then( data => {
            console.log('Data: ', data);
            books = data;
            for (let i = 0; i< books.length; i++) {
                if (books[i]!==undefined){
                    if(books[i].inStock) {
                        stock = 'Yes';
                        expired = '';
                    }  else {
                        stock = 'No';
                        if(books[i].expired) {
                            expired = 'Expired'
                        }
                    }
                    str +='<div class="book-element">' +
                        '<a href=books/'+books[i].id+'>' +
                        '<p>'+books[i].id+'. <strong>Name of book:</strong> '+books[i].name+'</p>' +
                        '<p><strong>Author:</strong> '+books[i].author+'</p>' +
                        '<p><strong>Genre:</strong> '+books[i].genre+'</p>' +
                        '<p><strong>About:</strong> '+books[i].about+'</p>' +
                        '<p><strong>Published: </strong>'+books[i].releaseDate+'</p>' +
                        '<p><strong>In stock: </strong>'+stock+'</p>' +
                        '<p style="color: darkred; font-weight: 600;">'+expired+'</p>' +
                        '</a><button id="delete" onclick="deleteBook('+i+')">Delete</button>' +
                        '</div>';
                }
            }
            tabBooks.innerHTML = str;
        });
}


// Add book

function addBook(){
    var bookName = document.querySelector('#name').value;
    var bookAuthor = document.querySelector('#author').value;
    var bookGenre = document.querySelector('#genre').value;
    var bookAbout = document.querySelector('#about').value;
    var bookReleaseDate = document.querySelector('#releaseDate').value;
    if(bookName && bookAuthor && bookReleaseDate && bookGenre && bookAbout) {
        book = {
            id: books.length,
            name: bookName,
            author: bookAuthor,
            genre: bookGenre,
            about:bookAbout,
            releaseDate: bookReleaseDate,
            inStock: true,
            expired: false,
            allReaders: [ {
                name: '',
                dateOfBegin: '',
                dateOfEnd: ''
            } ],
            currentReader: {
                name: '',
                dateOfBegin: '',
                dateOfEnd: ''
            }
        };
        console.log('Book object', book);
        books.push(book);
        console.log('Books array', book);
        console.log('Book date', bookReleaseDate.valueOf());
        fetch('http://localhost:3000/setData',{
            method: 'post',
            body: JSON.stringify(books),
            headers:{'content-type': 'application/json'}
        })
            .then(function(res){ return res.json(); })
            .then(function(data){ console.log('Set data request from client', JSON.stringify( data ) ) });
    }
    render();
}

// Sort by stock

function sortByStock() {
    str = ' ';
    books.sort(function(x, y) {
        // true values first
        return (x.inStock === y.inStock)? 0 : x? -1 : 1;
    });
    console.log(books);
    for (let i = 0; i< books.length; i++) {
        if (books[i]!==undefined){
            if(books[i].inStock) stock = 'Yes'; else stock = 'No';
            str +='<div class="book-element">' +
                '<a href=books/'+books[i].id+'>' +
                '<p>'+books[i].id+'. <strong>Name of book:</strong> '+books[i].name+'</p>' +
                '<p><strong>Author:</strong> '+books[i].author+'</p>' +
                '<p><strong>Genre:</strong> '+books[i].genre+'</p>' +
                '<p><strong>About:</strong> '+books[i].about+'</p>' +
                '<p><strong>Published: </strong>'+books[i].releaseDate+'</p>' +
                '<p><strong>In stock: </strong>'+stock+'</p>' +
                '<p style="color: darkred; font-weight: 600;">'+expired+'</p>' +
                '</a><button id="delete" onclick="deleteBook('+i+')">Delete</button>' +
                '</div>';
        }
    }
    tabBooks.innerHTML = str;
}

// Sort by date

function sortByExpire(){
    str = ' ';
    books.sort(function(x, y) {
        // true values first
        return (Date.parse(y.releaseDate) - Date.parse(x.releaseDate))
    });
    console.log(books);
    for (let i = 0; i< books.length; i++) {
        if (books[i]!==undefined){
            if(books[i].inStock) stock = 'Yes'; else stock = 'No';
            str +='<div class="book-element">' +
                '<a href=books/'+books[i].id+'>' +
                '<p>'+books[i].id+'. <strong>Name of book:</strong> '+books[i].name+'</p>' +
                '<p><strong>Author:</strong> '+books[i].author+'</p>' +
                '<p><strong>Genre:</strong> '+books[i].genre+'</p>' +
                '<p><strong>About:</strong> '+books[i].about+'</p>' +
                '<p><strong>Published: </strong>'+books[i].releaseDate+'</p>' +
                '<p><strong>In stock: </strong>'+stock+'</p>' +
                '<p style="color: darkred; font-weight: 600;">'+expired+'</p>' +
                '</a><button id="delete" onclick="deleteBook('+i+')">Delete</button></div>';
        }
    }
    tabBooks.innerHTML = str;
}

// Delete book
function deleteBook(index) {
    books.splice(index,1);
    console.log('Books array', books);
    fetch('http://localhost:3000/setData',{
        method: 'post',
        body: JSON.stringify(books),
        headers:{'content-type': 'application/json'}
    })
        .then(function(res){ return res.json(); })
        .then(function(data){ console.log('Set data request from client', JSON.stringify( data ) ) });
    render();
}
