const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    text: {
         type: String, 
         required: true
         },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    discussion: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Discussion', 
        required: true 
    },
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
         }],
    replies: [{
        text: {
            type: String
            },
            user: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User'
            },
            discussion: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Discussion' 
            },
            likes: [{ 
                type: mongoose.Schema.Types.ObjectId,
                 ref: 'User'
            }],
            createdOn: { 
                type: Date, 
                default: Date.now 
            },
         }],
    createdOn: { 
        type: Date, 
        default: Date.now 
    },
    isDeleted: {
        type:Boolean,
        default:false
    }
  },{timestamps: true});
  
 module.exports = mongoose.model('Comment', commentSchema);
  