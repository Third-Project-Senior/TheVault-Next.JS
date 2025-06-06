const express = require('express');
const commentController = require('../controllers/comment.controller');
const CommentRouter = express.Router();

// Routes
CommentRouter.post('/', commentController.createComment);
CommentRouter.get('/:productId', commentController.getCommentsByProductId); 
CommentRouter.put('/update/:id', commentController.updateComment);
CommentRouter.delete('/delete/:id', commentController.deleteComment); 


module.exports = CommentRouter;