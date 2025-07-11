const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/plagiarism-detector")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
const UserSchema = new mongoose.Schema({ 
    user: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    similarity: {
        type: Number,
        default: 0
    },
    similarity_with:{
        type: String,
        default: ""
    },
    flagged: {
        type: Boolean,
        default: false
    }});

const User = mongoose.model("User", UserSchema);
module.exports = User;