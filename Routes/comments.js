const {Comment, validateComment} = require("../Models/comment");
const express = require("express");
const router = express.Router();

//All comments
router.get("/", async (req, res) => {
    try {
        let comments = await Comment.find();
        if (!comments) return res.status(400).send(`No comments in this collection!`);
        return res.status(200).send(comments);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//ID product
router.get("/:commentId", async (req,res) => {
    try {
        let comment = await Comment.findById(req.params.commentId)
        if (!comment)
            return res.status(400).send(`Comment with Id of ${req.params.commentId} does not exist!`);
        return res.status(200).send(comment);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
})

// New Product
router.post("/", async (req, res) => {
    try {
        const {error} = validateComment(req.body)
        if (error) return res.status(400).send(error);
        return res.status(201).send(newComment)
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//Existing Product
router.put("/:commentId", async (req,res) => {
    try {
        const {error} = validateComment(req.body)
        if (error) return res.status(400).send(error);
        let comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, {new: true});
        if (!comment)
        return res.status(400).send(`Comment with Id of ${req.params.commentId} does not exist!`);
        return res.send(comment);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
})

// Delete product
router.delete("/:commentId", async (req, res) => {
    try {
        let comment = await Comment.findByIdAndDelete(req.params.commentId);
        if (!comment)
            return res.status(400).send(`Comment with Id of ${req.params.commentId} does not exist!`);
        return res.status(200).send(comment);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);   
    }
});


module.exports = router;

