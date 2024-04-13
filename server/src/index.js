import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { userRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.connect("");

app.listen(port, (error) => {
  if (error) {
    console.log("There was an error connecting to the server.");
  } else {
    console.log(`Server running on port ${port}.`);
  }
});
