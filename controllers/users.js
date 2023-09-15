import User from "../models/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const emailFormat = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
    };

export const getUsers = async (req, res) => {
  try {
   const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    if (endIndex < (await User.countDocuments().exec())) {
        results.next = {
            page: page + 1,
            limit: limit,
        };
        }
        if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit,
        };
        }
    results.results = await User.find().limit(limit).skip(startIndex).exec();
    res.json({currentPage: page, results});

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const register = async (req, res) => {
    const { firstname, lastname, age, data_of_birth, email, password } = req.body;
 
        if(!emailFormat(email)) return res.status(400).json({message: "email is not valid"});
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // check if email already exists
    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) return res.status(400).json({ message: "email already exists" });
    // create a new user
    const user = new User({
        firstname,
        lastname,
        age,
        data_of_birth,
        email,
        password: hashedPassword,
    });
    try {
        await user.save();
        res.json(user);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!emailFormat(email)) return res.status(400).json({message: "email is not valid"});
    // hash password and check if it matches with the one in the database
    const olUser = await User.findOne({ email });
    const secret = process.env.JWT_SECRET;
    try{
        const validPassword = await bcrypt.compare(password, olUser.password);
        if (!validPassword) return res.status(400).json({ message: "password is not correct" });
        // create and assign a token
        const token =  jwt.sign({
            id: olUser._id,
            email: olUser.email,
        }, secret,);

        res.json({ token });
    }catch(error){
        res.status(404).json({ message: error.message });
    }

}

export const createUser = async (req, res) => {
  const { firstname, lastname, age, data_of_birth, email } = req.body;
  // create a function to check email has a valid format
  const emailFormat = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
    };
    if(!emailFormat(email)) return res.status(400).json({message: "email is not valid"});


  const emailAlreadyExists = await User.findOne({ email });
  if (!emailAlreadyExists) {
    const user = new User({
      firstname,
      lastname,
      age,
      data_of_birth,
      email,
    });
    await user.save();
    res.json(user);
  } else {
    res.status(400).json({ message: "email already exists" });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No user with that id");
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
 const {user} = req;
  const { id } = req.params;
  console.log(user);
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);
  try {
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully.", user });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, age, data_of_birth } = req.body;
  const updatedUser = { firstname, lastname, age, data_of_birth };
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);
  try {
    await User.findByIdAndUpdate(id, updatedUser, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
