const mongoose = require('mongoose')

const discussionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',    //reference to user model
        required: true 
    },
    textField: {
        type: String
    },
    image: {
        type: String
    },
    hashTags: [{
        type: String   //taking Array of string for storing multiple hastags
    }], 
    createdOn:{
        type:Date,
        default: Date.now
    },
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment'
     }],
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
     }],
    viewCount: { 
        type: Number,
        default: 0 
    },
    isDeleted:{
        type: Boolean,
        default:false
    }
},{timestamps: true})

module.exports = mongoose.model('Discussion',discussionSchema)