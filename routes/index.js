var express = require('express');
var router = express.Router();
var Book = require('../models').Book;


// streamlines routes to wrap in handler
function asyncHandler (cb) {
  return async (req, res, next) => {
    try {
      await cb (req, res, next);
    } catch (err) {
      next(err);
    }
  }
}

// gets homepage and redirects to books
router.get("/", (req, res, next) => {
  res.redirect("/books");
});

// gets all books
router.get('/books', asyncHandler(async (req, res) => {
  // Error test
  // const err = new Error();
  // err.status = 500;
  // throw(err);
    const books = await Book.findAll();
    console.log(books);
    res.render('index', { books: books });
  }));

// renders create book form 
router.get('/books/new', asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    console.log(books);
    res.render('new-book');
  }));

// creates new book
router.post('/books/new', asyncHandler(async(req, res) => {
  let book;
  try { 
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render('new-book', { book, errors: error.errors, title: 'New Book'});
  } else {
    throw error;
  }
}
}));

// render individual book page
router.get( '/books/:id',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('update-book', { book, title: book.title });
    } else {
      res.render('page-not-found');
    }
  })
);

// updates book
router.post('/books/:id', asyncHandler(async(req, res) => {
  let book;
  try { 
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.render('page-not-found');
    }
   
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', { book, errors: error.errors, title: 'Edit Book'});
  } else {
    throw error;
  }
}
}));

// deletes book
router.post('/books/:id/delete', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.render('page-not-found');
  }

}));



module.exports = router;
