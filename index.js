import express from "express";
import mongoose from "mongoose";
import usersRoutes from "./routes/users.js";

const app = express();
app.use(express.json());
const uri =
  "mongodb+srv://alpha:12345@cluster0.bk4v9.mongodb.net/odcGroup2?retryWrites=true&w=majority";
                                                                                                                                                                                                   
const PORT = 5000;
mongoose.connect(uri)

app.use("/users", usersRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
