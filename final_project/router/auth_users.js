const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return false;
      } else {
        return true;
      }
    }

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
    }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.body.username;
  const ISBN = parseInt(req.params.isbn);
  let book_review = req.query.book_review;
  books[ISBN]["reviews"][username] = book_review;
  console.log(books[ISBN]["reviews"]);
  res.send(`review from ${username} successfully added to ISBN=${ISBN}. \n\n` + JSON.stringify(books, null, 4));
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.body.username;
    const ISBN = req.params.isbn;
    delete books[ISBN]["reviews"][username];
    res.send(`Review from ${username} successfully deleted on ISBN=${ISBN}. \n\n` + JSON.stringify(books, null, 4))
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
