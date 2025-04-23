import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

// Add new user (by admin)
export const addUser = async (req, res) => {
   try {
      const { name, password, userType, status } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
         name,
         password: hashedPassword,
         userType: userType || "user",
         status: status || "active",
      });

      await newUser.save();
      res.status(201).json({
         message: "User created successfully",
         user: newUser,
      });
   } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
      console.log("Error in the addUser controller:", error.message);
      
   }
};

// Update existing user (by admin)
export const updateUser = async (req, res) => {
  try {
    const { name } = req.body; 
    const { password, userType, status } = req.body;

    // Find the user by name
    const userToUpdate = await User.findOne({ name });

    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = { userType, status };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10); // Only hash if there's a password
    }

    // Update the user data
    const updatedUser = await User.findOneAndUpdate(
      { name },
      updateData,
      { new: true } // Return the updated document
    );

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
    console.log("Error in the updateUser controller:", error.message);
  }
};



//Login user

export const login = async (req, res) => {
   try {
      const JWT_SECRET = process.env.JWT_SECRET;
      const { name, password } = req.body;
      const user = await User.findOne({ name });
      const userPassword = bcrypt.compare(password, user.password);
      if (!user || !userPassword) {
         return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (user.status !== "active") {
         return res.status(403).json({ message: "Account inactive" });
      }
      
      const token = jwt.sign(
         { _id: user._id, userType: user.userType, name: user.name },
         JWT_SECRET,
         { expiresIn: "7d" }
      );
      
      res.status(200).json({
         token,
         user: {
        _id: user._id,
        name: user.name,
        userType: user.userType,
        membershipId: user.membershipId || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
   }
};


// Get all users (by admin)
export const getAllUsers = async (req, res) => {
   try {
      const users = await User.find().select("-password"); // Exclude password from the response
      res.status(200).json(users);
   } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
      console.log("Error in the getAllUsers controller:", error.message);
   }
};