const express = require('express')
const User = require('../models/userModel')
const { response } = require('../helper/response');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//function to register or create user
exports.registerUser = async(req,res) => {
    try{
        const {name, email,countryCode, mobileNo, password} = req.body;
        if(!name)
        return response(res, 400, false, 'Name is required')
        if(!email)
        return response(res, 400, false, 'Email is required')
        if(!countryCode)
        return response(res, 400, false, 'Country Code is required')
        if(!mobileNo)
        return response(res, 400, false, 'Mobile Number is required')
        if(!password)
            return response(res, 400, false, 'Password is required')

        const userExists = await User.findOne({ email, status:'active' });
        if (userExists) {
          return response(res, 400, true, 'User already Exist',{})
        }
        const hashedPassword = await bcrypt.hash(password, 12);
     const newUser = await User.create({
        name,
        email,
        mobileNo,
        password: hashedPassword
     })
     return response(res, 200, true, 'User created successfully', {newUser})

    } catch (error) {
        console.log(error);
        return response(res, 500, false, 'Internal Server Error')
    }
}

//function to login user
exports.login = async(req,res) => {
    try{
        const {email, password} = req.body;
        if(!email)
        return response(res, 400, false, 'Email is required')
        if(!password)
        return response(res, 400, false, 'Password is required')

        const user = await User.findOne({ email, status: 'active' });
        if(!user){
            return response(res, 400, false, 'User does not exist',{})
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
          return res.status(401).send({ message: 'Password Incorrect' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        let userForResponse = {
            _id: user._id,
            email: user.email,
            token: token
          };
          return response(res, 200, true, 'User login successfully', userForResponse);
    }catch (error) {
        console.log(error);
        return response(res, 500, false, 'Internal Server Error')
    }
}
//fucntion to update user information
exports.updateUser = async(req,res) => {
    try{
        const userId = req.params.userId;
        const user = await User.findOne({_id:userId, status:'active'})
        if(!user){
            return response(res, 400, false, 'User does not exist',{})
        }
        const {name, email,countryCode, mobileNo} = req.body;
        const updatedUser = await User.findOneAndUpdate({_id:userId},req.body,{new:true})
        return response(res, 200, true, 'User updated successfully',{updatedUser})
    }catch (error) {
        console.log(error);
        return response(res, 500, false, 'Internal Server Error')
    }
}
//function to get single user information
exports.getUser = async(req,res) => {
    try{
        const userId = req.params.userId;
        const user = await User.findOne({_id:userId, status:'active'})
        if(!user){
            return response(res, 400, false, 'User does not exist',{})
        }
        return response(res, 200, true, 'User fetched successfully',{user})

    }catch (error) {
        console.log(error);
        return response(res, 500, false, 'Internal Server Error')
    }
}
//fucntion to get all users and user can search another user based on name
 exports.getAllusers = async(req,res) => {
    try {
        const { name } = req.query;
        // Extracting pagination parameters from query string
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        let query = {};
        let users;
        if (name) {
            // Find users with a name that matches the query, case-insensitive
            users = await User.find({ name: { $regex: name, $options: 'i' }, status: 'active' })
        } else {
            // Find all active users
            users = await User.find({ status: 'active' }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);;
        }
        const noOfEntries = await User.countDocuments(query)

        if (!users || users.length === 0) {
            return response(res, 404, false, 'No users found');
        }

        return response(res, 200, true, 'Users retrieved successfully', { noOfEntries, users });
    } catch (error) {
        console.error('Error retrieving users:', error);
        return response(res, 500, false, 'Internal Server Error');
    }
 }
 //function to delete particular user
 exports.deleteUser = async(req,res) => {
    try{
        const userId = req.params.userId;
        const user = await User.findOne({_id:userId, status:'active'})
        if(!user){
            return response(res, 400, false, 'User does not exist',{})
        }
        //soft deleting the user
        // const deletedUser = await User.findOneAndUpdate({_id:userId},{status:'inactive'},{new:true})

        //hard delete the user (we are taking email and mobile unique so need to hard delete if want to register the same user again)
        const deletedUser = await User.findOneAndDelete({_id:userId})
        return response(res, 200, true, 'user deleted successfully',{deletedUser})
    }catch (error) {
        console.log(error);
        return response(res, 500, false, 'Internal Server Error')
    }
 }

 //fucntion to follow users
 exports.followUser = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { followedUser } = req.body;

        if (!followedUser) {
            return response(res, 400, false, 'User ID to follow is required');
        }

        const userToFollow = await User.findById(followedUser);
        if (!userToFollow) {
            return response(res, 404, false, 'User to follow not found');
        }

        const user = await User.findById(userId);
        if (!user) {
            return response(res, 404, false, 'User not found');
        }

        if (user.followedUsers.includes(followedUser)) {
            return response(res, 400, false, 'User is already followed');
        }

        user.followedUsers.push(followedUser);
        await user.save();

        return response(res, 200, true, 'User followed successfully', { followedUsers: user.followedUsers });
    } catch (error) {
        console.error('Error following user:', error);
        return response(res, 500, false, 'Internal Server Error');
    }
};