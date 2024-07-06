const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    countryCode:{
        type: String
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
    }],
    followedUsers: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    }],
    status: {
        type: String,
        enum: ['active','inactive'],
        default:'active'
    }
},{timestamps:true});

module.exports = mongoose.model('User',userSchema)