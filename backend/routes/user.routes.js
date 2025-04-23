import express from "express";
import { addUser, login, updateUser, getAllUsers } from "../controllers/user.controller.js";
import { allowRoles, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Add user
router.post("/add",verifyToken, allowRoles('admin'), addUser);

// Update user
router.patch("/update",verifyToken, allowRoles('admin'), updateUser);

// Login user
router.post("/login", login);

// Get all users
router.get("/", verifyToken, allowRoles('admin'), getAllUsers);


export default router;
