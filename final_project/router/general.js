const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      if (isValid(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  const get_books = new Promise((resolve, reject) => {
      resolve(res.send(JSON.stringify(books, null, 4)))
  });
  get_books.then(() => console.log("Promise for task 10 resolved!"))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  let book =  books[ISBN];
  const book_details = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify(book, null, 4)))
})
  book_details.then(() => console.log("Task 11 completed successfully!"))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let ISBN_list = Object.keys(books).map(isbn => parseInt(isbn));
  let filtered_books = [];
  for (let i=0; i < ISBN_list.length; i++) {
      ISBN = ISBN_list[i];
      if (author === books[ISBN]["author"]) {
          filtered_books.push(books[ISBN])
      }
  }
  res.send(JSON.stringify(filtered_books, null, 4))
});

// ^ with Promises
public_users.get('/async-filter-by-author/:author',function (req, res) {
    const author = req.params.author;
    let ISBN_list = Object.keys(books).map(isbn => parseInt(isbn));
    let filtered_books = [];
    const get_books_by_author = new Promise((resolve, reject) => {
        resolve()
    })
    for (let i=0; i < ISBN_list.length; i++) {
        ISBN = ISBN_list[i];
        if (author === books[ISBN]["author"]) {
            filtered_books.push(books[ISBN])
        }
    }
    res.send(JSON.stringify(filtered_books, null, 4))
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let ISBN_list = Object.keys(books).map(isbn => parseInt(isbn));
    let filtered_books = [];
    for (let i=0; i < ISBN_list.length; i++) {
        ISBN = ISBN_list[i];
        if (title === books[ISBN]["title"]) {
            filtered_books.push(books[ISBN])
        }
    }
    res.send(JSON.stringify(filtered_books, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  let review = books[ISBN]["reviews"]
  res.send(JSON.stringify(review, null, 4));
});

module.exports.general = public_users;
