import express from "express";
import { addMembership, getAllMemberships, updateMembership, deleteMembership } from "../controllers/membership.controller.js";
import { allowRoles, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Route to add a membership
router.post("/",verifyToken, allowRoles('admin'), addMembership);

// Route to update a membership by ID
router.patch("/:id",verifyToken, allowRoles('admin'), updateMembership);

// Route to get all memberships
router.get("/", getAllMemberships);

//delete membership
router.delete("/:id", deleteMembership);

export default router;
