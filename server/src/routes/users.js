import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../models/users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username: username });

  //if the user already exists
  if (user) {
    return res.json({ message: "This user already exists" });
  }

  //hashing the data to be sent
  const hashedPassword = await bcrypt.hash(password, 13);

  //creating the new user
  const newUser = new userModel({
    username: username,
    password: hashedPassword,
  });
  await newUser.save();

  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username: username });

  //if user does not exist
  if (!user) {
    return res.json({ message: "User does not exist" });
  }

  //if the password matches
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ message: "Incorrect username or password" });
  }

  //now the JWT part begins
  const token = jwt.sign({ id: user._id }, "jgRxKIryPumGL"); //use environment variable for this secret instead

  res.json({ token, userID: user._id });
});

export { router as userRouter };

//middleware to verify token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, "jgRxKIryPumGL", (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
