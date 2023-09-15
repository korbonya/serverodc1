import mongoose from "mongoose";

const userShema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: String,
    age: Number,
}, {timestamps: true})

const User = mongoose.model("User", userShema)

export default User;