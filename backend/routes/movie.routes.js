import express from "express";
import { addMovie, getAllMovies, updateMovie } from "../controllers/movie.controller.js";
import { allowRoles, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Route to add a movie
router.post("/",verifyToken, allowRoles('admin'), addMovie);

// Route to update a movie by ID
router.patch("/",verifyToken, allowRoles('admin'), updateMovie);

// Route to get all movies
router.get("/", getAllMovies);

export default router;
