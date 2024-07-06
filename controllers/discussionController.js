const express = require('express')
const User = require('../models/userModel')
const Discussion = require('../models/discussionModel')
const { response } = require('../helper/response');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//function to create discussion/post
exports.createDiscussion = async(req,res) => {
    try{
        const userId = req.user._id;
        const user = await User.findOne({_id:userId, status:'active'})
        if(!user){
            return response(res, 400, false, 'User not found',{})
        }
      
        const {textField,image,hashTags,createdOn} = req.body;
        const newDiscussion = await Discussion.create({
            textField,
            image,   //we can use AWS S3 or any other file storage system for storing signle file and multiple file
            hashTags,
            createdOn,
            user:userId
        })
    return response(res, 200, true, 'Discussion created successfully',{newDiscussion})
    }catch (error) {
    console.log(error);
    return response(res, 500, false, 'Internal Server Error');
  }
}

//fucntion to modify the discussion/post
exports.updateDiscussion = async(req,res) => {
    const { textField, image, hashTags } = req.body;
    const discussionId = req.params.discussionId;

    try {
        // Fetch the existing discussion from MongoDB
        let discussion = await Discussion.findById(discussionId);

        if (!discussion) {
            return res.status(404).json({ success: false, message: 'Discussion not found' });
        }

        // Update discussion fields
        discussion.textField = textField;
        discussion.hashTags = hashTags;

        // Handle image update if provided in request
        if (req.file) {
            const uploadedFileLink = await uploadFile(req.file);
            discussion.image = uploadedFileLink;
        } else if (image) {
            discussion.image = image;
        }

        // Save updated discussion to MongoDB
        await discussion.save();

        // Respond with success message and updated discussion data
        return response(res, 200, true, 'Discussion updated successfully',{discussion})
    } catch (error) {
        console.error('Error updating discussion:', error);
        return response(res, 500, false, 'Internal Server Error');
    }
}

//function to get all the discussions/posts also user can search based on tags and text also
exports.discussions = async(req, res) => {
    try {
        // Get the tags and text from request query params
        const tags = req.query.tags;
        const text = req.query.text;

        // Initialize the query object
        let query = {};

        // If tags are provided, add them to the query
        if (tags) {
            query.hashTags = { $in: Array.isArray(tags) ? tags : [tags] };
        }

        // If text is provided, add it to the query using a case-insensitive partial match
        if (text) {
            query.textField = { $regex: text, $options: 'i' };
        }

        // Find discussions based on the constructed query
        const discussions = await Discussion.find(query);

        if (!discussions || discussions.length === 0) {
            return res.status(404).json({ success: false, message: 'No discussions found' });
        }

        return response(res, 200, true, 'Discussions retrieved successfully', { discussions });
    } catch (error) {
        console.error('Error fetching discussions:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

//function to delete the discussion/post
exports.deleteDiscussion = async (req, res) => {
    try {
      const userId = req.user._id; 
      
      const discussionId = req.params.discussionId;
  
      // Find the discussion by ID and user ID to ensure the user is authorized to delete
      const discussion = await Discussion.findOneAndDelete({ _id: discussionId, user: userId });
  
      if (!discussion) {
        return response(res, 404, false, 'Discussion not found or you are not authorized to delete this discussion');
      }
  
      return response(res, 200, true, 'Discussion deleted successfully');
    } catch (error) {
      console.error('Error deleting discussion:', error);
      return response(res, 500, false, 'Internal Server Error');
    }
  };


//function to get the view count of post
exports.getViewCount = async (req, res) => {
    try {
        const discussionId = req.params.discussionId;

        // Find the discussion by ID and fetch the views
        const discussion = await Discussion.findById(discussionId);

        if (!discussion) {
            return res.status(404).json({ success: false, message: 'Discussion not found' });
        }

        return response(res, 200, true, 'View Count fetched successfully', {views: discussion.views });
    } catch (error) {
        console.error('Error fetching view count:', error);
        return response(res, 500, false, 'Internal Server Error');
    }
};

