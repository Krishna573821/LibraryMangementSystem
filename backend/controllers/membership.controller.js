import Membership from "../models/membership.model.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

// Add a new membership
export const addMembership = async (req, res) => {
  try {
    const newMembership = new Membership(req.body);
    const savedMembership = await newMembership.save();

    const userId = req.body.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { membershipId: savedMembership._id },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found to update membershipId" });
    }

    res.status(201).json(savedMembership);
  } catch (error) {
    console.error("Error in addMembership controller:", error.message);
    res.status(400).json({ message: "Failed to add membership", error });
  }
};

// Update an existing membership
export const updateMembership = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedMembership = await Membership.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedMembership) {
      return res.status(404).json({ message: "Membership not found" });
    }
    res.status(200).json({data: updatedMembership});
  } catch (error) {
    res.status(400).json({ message: "Failed to update membership", error });
    console.log("Error in updateMembership controller:", error.message);
  }
};

// get all memberships


export const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();

    const result = await Promise.all(
      memberships.map(async (membership) => {
        // Calculate total fine for this membership's user
        const totalFine = await Transaction.aggregate([
          { $match: { userId: membership.userId, fine: { $gt: 0 }, status: { $in: ['overdue', 'returned'] } } },
          { $group: { _id: null, total: { $sum: "$fine" } } }
        ]);

        const fineAmount = totalFine.length > 0 ? totalFine[0].total : 0;

        return {
          membershipId: membership._id,
          nameOfMember: `${membership.firstName} ${membership.lastName}`,
          contactNumber: membership.contactNumber,
          contactAddress: membership.contactAddress,
          aadharCardNo: membership.aadhaarNo,
          startDate: membership.startDate,
          endDate: membership.endDate,
          status: new Date(membership.endDate) > new Date() ? "Active" : "Inactive",
          amountPending: fineAmount,
        };
      })
    );

    res.status(200).json({
      message: "Memberships fetched successfully",
      data: result,
    });

  } catch (error) {
    console.error("Error in getAllMemberships controller:", error.message);
    res.status(400).json({
      message: "Failed to fetch memberships",
      error: error.message,
    });
  }
};


//delete membership
export const deleteMembership = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMembership = await Membership.findByIdAndDelete(id);
    if (!deletedMembership) {
      return res.status(404).json({ message: "Membership not found" });
    }
    res.status(200).json({ message: "Membership deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete membership", error });
    console.log("Error in deleteMembership controller:", error.message);
  }
};