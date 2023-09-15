import User from "../models/user.js";

export const getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
    };

export const createUser = async (req, res) => {
    const { firstname, lastname, age, data_of_birth } = req.body;
    const user = new User({
        firstname,
        lastname,
        age,
        data_of_birth,
    });
    await user.save();
    res.json(user);
};

export const getUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({message: "User deleted successfully."});
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, age, data_of_birth } = req.body;
    
    const updatedUser = { firstname, lastname, age, data_of_birth };

    await User.findByIdAndUpdate(id, updatedUser, { new: true });
    res.json(updatedUser);
}
