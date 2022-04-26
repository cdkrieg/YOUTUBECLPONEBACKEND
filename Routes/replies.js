const express = require("express");
const { Comment, validateComment } = require("../models/comment");
const { Reply, validateReply } = require("../models/reply");
const { send } = require("express/lib/response");
const router = express.Router();


//POST a reply
//http://localhost:3007/api/replies

router.post("/", async (req,res)=>{
    try {
        let { error } = validateReply(req.body);
        if (error) return res.status(400).send(`Body for reply not valid! ${error}`);
  
        let newReply = await new Reply(req.body);
        await newReply.save();
        return res.status(201).send(newReply);

    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    };
});

//GET all replies
//http://localhost:3007/api/replies

router.get("/", async (req,res)=>{
    try {
        let replies = await Reply.find();
        if (!replies) return res.status(400).send(`No replies in the collection!`);
        return res.send(replies);
      
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});


module.exports = router; 
