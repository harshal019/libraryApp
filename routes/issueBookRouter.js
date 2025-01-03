const express = require("express");
const router = express.Router();
const authMidddleware = require("../middlewares/authMidddleware");
const IssueBook = require("../models/IssueBooks");
const isLibrarian = require("../helper");
const Book = require("../models/Book");
const { param } = require("./userRouter");

router.post("/issue-book", authMidddleware, async (req, res) => {
  try {
    if (isLibrarian === req.user.userId) {
      //get the data
      const {
        studentId,
        studentName,
        bookId,
        bookName,
        issueDate,
        returnDate,
      } = req.body;

      //check book exist or not
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ message: "Book Not found" });
      }

      //check book avilable or not
      if (book.qunatity < 1) {
        return res.status(400).json({ messgae: " Book Not avilable" });
      }
      //avilabale
      const issuedBook = new IssueBook({
        studentId,
        studentName,
        bookId,
        bookName,
        issueDate,
        returnDate,
        status: "Pending",
      });

      await issuedBook.save();

      //update book quantity
      book.quantity -= 1;
      await book.save();

      return res.status(200).json(issuedBook);
    } else {
      return res
        .status(404)
        .json({ message: "Your are not authorized to access this  book" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something while wrong while issue the book",
      error: error.message,
    });
  }
});

router.post("/return-book/:id", authMidddleware, async (req, res) => {
  try {
    if (isLibrarian(req.user.userId)) {
        
        //get the id of the book
        const{id}=req.params;

        //find the issued book
        const issuedBook =await Book.findById(id);

        //if issued book not existed
        if(!issuedBook){
            return res.status({message:"Record not found"});
        }

        //if book returned once then => do not return the book again
        if(issuedBook.status == "Returned"){
            return res.status(404).json({
                message:"Book ha already taken"
            })
        }

        //aslo find the book 
        const book =await Book.findById(issuedBook.bookId);

        if(!book){
            return res.status(400).json({message:"Book not found"});
        }

        issuedBook.status="Returned";
        issuedBook.save();




        //update the  book quantity or recorded
        book.quantity+=1;
        book.save();


        return res.status(200).json(issuedBook);
        
    } else {
      return res
        .status(404)
        .json({ message: "Your are not authorized to access this  book" });
    }
  } catch (error) {
    res.status(500).json({
        message: "Something while wrong while returning the book",
        error: error.message,
      });
  }
});


router.get("/",async(req,res)=>{

    try {
        
        const issuedBook=await IssueBook.find({});
        return res.status(200).json(issuedBook);


    } catch (error) {
        res.status(500).json({
            message: "Something while wrong while fetching  the  book data",
            error: error.message,
          });
    }
})


router.get("/:id",async(req,res)=>{

    try {
        
        const issuedBook=await IssueBook.find(req,param.id);
        return res.status(200).json(issuedBook);


    } catch (error) {
        res.status(500).json({
            message: "Something while wrong while fetching  the  book data by specific user",
            error: error.message,
          });
    }
})

router.get("/stduent-name/stuentName",async(req,res)=>{

    try {
        
        const issuedBook=await IssueBook.find({studentName:req.param.studentName});
        return res.status(200).json(issuedBook);


    } catch (error) {
        res.status(500).json({
            message: "Something while wrong while fetching  the  book data",
            error: error.message,
          });
    }
})

router.get("/stduent-id/stuentId",async(req,res)=>{

    try {
        
        const issuedBook=await IssueBook.find({studentName:req.param.studentId});
        return res.status(200).json(issuedBook);


    } catch (error) {
        res.status(500).json({
            message: "Something while wrong while fetching  the  book data",
            error: error.message,
          });
    }
})


router.get("/book-id/bookId",async(req,res)=>{

    try {
        
        const issuedBook=await IssueBook.find({studentName:req.param.bookId});
        return res.status(200).json(issuedBook);


    } catch (error) {
        res.status(500).json({
            message: "Something while wrong while fetching  the  book data",
            error: error.message,
          });
    }
})


router.get("/book-name/bookName",async(req,res)=>{

    try {
        
        const issuedBook=await IssueBook.find({studentName:req.param.bookName});
        return res.status(200).json(issuedBook);


    } catch (error) {
        res.status(500).json({
            message: "Something while wrong while fetching  the  book data",
            error: error.message,
          });
    }
})

module.exports=router;