
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema({
    title: String,
    about: String,
    content: String,
    starttime: String,
    endtime: String,
    location: String,
    contact: String,
    website: String,
    email: String,
    cover: String,
    logo: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const PostModel = model('Post', PostSchema);

module.exports = PostModel;


// const mongoose = require("mongoose");

// const PostSchema = new mongoose.Schema({
//   title: String,
//   about: String,
//   content: String,
//   cover: String,
//   logo: String,
//   rating: String,
//   location: String,
//   timings: String,
//   contact: String,
//   website: String,
//   email: String,
//   signatureDish: String,
//   chefSpecial: String,
//   vegetarianOption: Boolean,
//   dessert: String,
//   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   ambianceImages: [String], // NEW

// }, {
//   timestamps: true,
// });

// module.exports = mongoose.model("Post", PostSchema);
