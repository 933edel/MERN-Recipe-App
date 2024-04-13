import express from "express";
import mongoose from "mongoose";

import { recipeModel } from "../models/recipes.js";
import { userModel } from "../models/users.js";

import { verifyToken } from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await recipeModel.find({});
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

//to enable users to "CREATE" a new recipe
router.post("/", verifyToken, async (req, res) => {
  const recipe = new recipeModel(req.body);

  try {
    const response = await recipe.save();
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

//To enable users to "UPDATE" recipes
router.put("/", verifyToken, async (req, res) => {
  const recipe = await recipeModel.findById(req.body.recipeID);
  const user = await userModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get a recipe by ID
router.get("/savedrecipes/ids/:userID", verifyToken, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userID);

    res.json({ savedRecipes: user?.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

//to "READ" the user's saved recipes
router.get("/savedrecipes/:userId", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    const savedRecipes = await recipeModel.find({
      _id: { $in: user.savedRecipes },
    });

    // console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE route for deleting a recipe
// router.delete("/:recipeId", verifyToken, async (req, res) => {
//   try {
//     const deletedRecipe = await recipeModel.findByIdAndDelete(req.params.recipeId);
//     if (!deletedRecipe) {
//       return res.status(404).json({ message: "Recipe not found" });
//     }
//     res.status(200).json({ message: "Recipe deleted successfully", deletedRecipe });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

export { router as recipesRouter };
