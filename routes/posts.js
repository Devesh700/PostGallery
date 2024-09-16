const mongoose = require("mongoose");
require("dotenv");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/PostGallery";

mongoose.connect(`mongodb+srv://deveshmishra6666:6oBkl6ACuFihuvqO@postgallery.f15ta.mongodb.net/?retryWrites=true&w=majority&appName=PostGallery/PostGallery`, { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  title: String,
  description: String,
  image: String
});

module.exports = mongoose.model("posts", postSchema);
