const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
    comment: {type: String, required: true, minlength:1, maxlength:250},
    dateAdded: {type: Date, default: Date.now()},
});

function validateComment(comment){
    const schema = Joi.object({
        comment: Joi.string().min(2).max(250).required(),
    })
        return schema.validate(comment);
}

const Comment = mongoose.model('Comment', commentSchema);
module.exports = {
    Comment,
    validateComment,
    commentSchema,
}; 