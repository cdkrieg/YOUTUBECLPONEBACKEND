const {Comment, validateComment} = require("../Models/comment");
const {Reply, validateReply} = require("../Models/reply");
const express = require("express");
const {append} = require("express/lib/response")
const router = express.Router();

//GET all comments
//http://localhost:5000/api/comments
router.get("/", async (req, res) => {
    try {
        let comments = await Comment.find();
        if (!comments) return res.status(400).send(`No comments in this collection!`);
        return res.send(comments);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//GET a comment by videoid
//http://localhost:5000/api/comments/:videoId
router.get("/:videoId", async (req, res)=>{
    try {
        let comment = await Comment.find(req.params, {}, { _id: 0, videoId: 1});
        if (!comment)
            return res
            .status(400)  
            return res
            .status(200)
            .send(comment);       
        } catch (error) {
            return res
            .status(500)
            .send(`Internal Server Error: ${error}`);        
        }
    })
    

//PUT update a Comment
router.put("/:id", async (req, res) => {
    try {
        let comment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                body: req.body.body,
                like: req.body.like,
                dislike: req.body.dislike,
                replies: req.body.replies
            },
            {new:true}
        );
        if (!comment) return res.status(400).send(`Comment with id "${req.params.id}" does not exist!`);
        return res.send(comment);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//DELETE a Comment
//http://localhost:5000/api/comments/6254e000fbe3ae214584dba7
router.delete("/:id", async (req, res) => {
    try {
        let comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) return res.status(400).send(`Comment with id "${req.params.id}" does not exist!`);
        return res.send(comment);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//POST new Comment
router.post("/", async (req, res) => {
    try {
        const {error} = validateComment(req.body)
        if (error) return res.status(400).send(error);
        let newComment = await new Comment(req.body);
        await newComment.save();
        return res.status(201).send(newComment);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

//comment like
//http://localhost:5000/api/comments/:commentId/commentLike
router.put("/:commentId/commentLike", async (req, res)=>{
    try {
        let comment = await Comment.findById(req.params.commentId);
        if (!comment)
         return res
         .status(400)
         .send(`Comment with Id of ${req.params.commentId} does not exist!`);

         comment.likes++;
         await comment.save();

         return res
         .status(200)
         .send(comment);        
    } catch (error) {
        return res
        .status(500)
        .send(`Internal Server Error: ${error}`);

    }
})
// comment dislike
//http://localhost:5000/api/comments/:commentId/commentDisLike
router.put("/:commentId/commentDisLike", async (req, res)=>{
    try {
        let comment = await Comment.findById(req.params.commentId);
        if (!comment)
         return res
         .status(400)
         .send(`Comment with Id of ${req.params.commentId} does not exist!`);

         comment.dislikes++;
         await comment.save();

         return res
         .status(200)
         .send(comment);        
    } catch (error) {
        return res
        .status(500)
        .send(`Internal Server Error: ${error}`);

    }
})

//POST a reply to a comment
//http://localhost:5000/api/comments/:commentId/replies/:replyId
router.post("/:commentId/replies/:replyId", async(req,res)=>{
    try {
        let comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(400).send(`No comment with ID ${req.params.commentId}!`);

        let reply = await Reply.findById(req.params.replyId);
        if (!reply) return res.status(400).send(`Reply with ID ${req.params.replyId} does not exist!`);

        comment.replies.push(reply);
        await comment.save();
        return res.send(comment.replies);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
})

module.exports = router;