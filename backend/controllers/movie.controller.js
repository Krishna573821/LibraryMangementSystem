import Movie from "../models/movie.model.js";

// Add a new movie
export const addMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: "Failed to add movie", error });
    console.log("Error in the addMovie controller:", error.message);
  }
};

// Update an existing movie
export const updateMovie = async (req, res) => {
  const { title, ...updateFields } = req.body; // Destructure title and other fields from the body

  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { title }, // Search using title from request body
      updateFields, // Update all other fields
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found with the given title" });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: "Failed to update movie", error });
    console.log("Error in the updateMovie controller:", error.message);
  }
};


//get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch movies", error });
    console.log("Error in the getAllMovies controller:", error.message);
  }
};