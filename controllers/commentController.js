const express = require('express')
const User = require('../models/userModel')
const Discussion = require('../models/discussionModel')
const Comment = require('../models/commentModel')
const {response} = require('../helper/response')

//function to add comment on the post
exports.addComment = async(req,res) => {
    try{
        const userId = req.user._id;
        const userExist = await User.findOne({_id:userId, status:'active'})
        if(!userExist){
            return response(res, 400, false, 'User does not exist',{})
        }
        const discussionId = req.params.discussionId;
        // Fetch the existing discussion from MongoDB
        const discussionExist = await Discussion.findOne({_id:discussionId, isDeleted: false});

        if (!discussionExist) {
            return res.status(404).json({ success: false, message: 'Discussion not found' });
        }

      const {text,user,discussion, likes} = req.body;
      const newComment = await Comment.create({
        text,
        user:userId,
        discussion: discussionId,
        createdOn: Date.now()
      })
      discussionExist.comments.push(newComment);
      await discussionExist.save();
      
      return response(res, 200, true, 'Comment posted successfully',{newComment})
    }catch (error) {
        console.log(error);
        return response(res, 500, false, 'Internal Server Error');
      }
}

//function to like the post
exports.likePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { discussionId } = req.body;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return response(res, 404, false, 'Discussion not found');
        }

        const likeExists = discussion.likes.some(like => like.toString() === userId.toString());
        if (likeExists) {
            return response(res, 400, false, 'User already liked this discussion');
        }
        discussion.likes.push(userId);
        await discussion.save();

        return response(res, 200, true, 'Discussion liked successfully', { discussion });
    } catch (error) {
        console.error('Error in liking discussion:', error);
        return response(res, 500, false, 'Internal Server Error');
    }
};

// function to modify comment
exports.updateComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findOne({_id:commentId, isDeleted:false})
        if(!comment){
            return response(res, 400, false, 'Comment not found')
        }
        const { text } = req.body;

        // Find the comment by ID and update its text
        const updatedComment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });

        return response(res, 200, true, 'Comment modified successfully',{updatedComment})
    } catch (error) {
        console.error('Error updating comment:', error);
        return response(res, 500, false, 'Internal Server Error');
    }
};

//fucntion to delete comment
exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findOne({_id:commentId, isDeleted:false})
        if(!comment){
            return response(res, 400, false, 'Comment not found')
        }
        // Find the comment by ID and mark it as deleted
        const deletedComment = await Comment.findByIdAndUpdate(commentId, { isDeleted: true }, { new: true });

        return response(res, 200, true, 'Comment deleted successfully',{deletedComment})
    } catch (error) {
        console.error('Error deleting comment:', error);
        return response(res, 500, false, 'Internal Server Error');
    }
};

//function to like the comment
exports.likeComment = async (req, res) => {
    try {
        const { commentId } = req.body;
        const comment = await Comment.findOne({_id:commentId, isDeleted:false})
        if(!comment){
            return response(res, 400, false, 'Comment not found')
        }
        const userId = req.user._id; 
        const alreadyLiked = comment.likes.some(like => like.equals(userId));

        if (alreadyLiked) {
            return res.status(400).json({ success: false, message: 'User already liked this comment' });
        }

        // Add user to likes array
        comment.likes.push(userId);
        await comment.save();

        return response(res, 200, true, 'Comment liked successfully',{ comment });
    } catch (error) {
        console.error('Error liking comment:', error);
        return response(res, 500, false, 'Internal Server Error');
    }
};

//function to reply on the comment
exports.replyToComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findOne({_id:commentId, isDeleted:false})
        if(!comment){
            return response(res, 400, false, 'Comment not found')
        }
        const { text } = req.body;
        // Validate if text is provided
        if (!text) {
            return res.status(400).json({ success: false, message: 'Reply text is required' });
        }

        const userId = req.user._id; 

        // Create the reply object
        const newReply = {
            text,
            user: userId,
            discussion: comment.discussion,
            createdOn: Date.now()
        };

        // Push the new reply into the replies array of the comment
        comment.replies.push(newReply);
        
        // Save the updated comment
        await comment.save();
        
        return response(res, 200, true, 'Reply added successfully',{ comment });
    } catch (error) {
        console.error('Error adding reply:', error);
        return response(res, 500, false, 'Internal Server Error');
    }
};