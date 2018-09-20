const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  time: Date,
  locationComment: Boolean,
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
})

commentSchema.statics.format = (comment) => {
  return{
    id: comment._id,
    user: comment.user,
    comment: comment.comment,
    time: comment.time,
    locationComment: comment.locationComment,
    location: comment.location,
    event: comment.event,
  }
}

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment