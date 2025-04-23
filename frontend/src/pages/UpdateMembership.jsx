import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateMembership = () => {
  const [memberships, setMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [membershipForm, setMembershipForm] = useState({
    startDate: "",
    plan: "6-months",
    membershipRemove: "no", 
  });

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/memberships", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMemberships(res.data.data);
      } catch (err) {
        console.error("Error fetching memberships:", err.message);
      }
    };
    fetchMemberships();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMembershipForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMembership) return alert("Select a membership first.");

    const token = localStorage.getItem("token");

    try {
      if (membershipForm.membershipRemove === "yes") {
        await axios.delete(`http://localhost:5000/api/memberships/${selectedMembership.membershipId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Membership removed successfully!");
      } else {
        await axios.patch(
          `http://localhost:5000/api/memberships/${selectedMembership.membershipId}`,
          {
            startDate: membershipForm.startDate,
            plan: membershipForm.plan,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Membership updated successfully!");
      }

      setSelectedMembership(null);
      setMembershipForm({ startDate: "", plan: "6-months", membershipRemove: "no" });

      const res = await axios.get("http://localhost:5000/api/memberships", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMemberships(res.data.data);
    } catch (error) {
      toast.error("Error updating membership");
      console.error("Error updating membership:", error.message);
    }
  };

  return (
    <div>
      <h2>Update Membership</h2>

      <table border="1" cellPadding={5}>
        <thead>
          <tr>
            <th>Membership ID</th>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((m) => (
            <tr key={m.membershipId}>
              <td>{m.membershipId}</td>
              <td>{m.nameOfMember}</td>
              <td>{new Date(m.startDate).toLocaleDateString()}</td>
              <td>{new Date(m.endDate).toLocaleDateString()}</td>
              <td>{m.status}</td>
              <td>
                <button
                  onClick={() => {
                    setSelectedMembership(m);
                    setMembershipForm({
                      startDate: m.startDate.split("T")[0],
                      plan: "6-months", 
                      membershipRemove: "no",
                    });
                  }}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMembership && (
        <div style={{ marginTop: "20px" }}>
          <h3>Update Membership - ID: {selectedMembership.membershipId}</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Start Date: </label>
              <input
                type="date"
                name="startDate"
                value={membershipForm.startDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label>Membership Plan:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="plan"
                    value="6-months"
                    checked={membershipForm.plan === "6-months"}
                    onChange={handleInputChange}
                  />
                  6 Months
                </label>
                <label>
                  <input
                    type="radio"
                    name="plan"
                    value="1-year"
                    checked={membershipForm.plan === "1-year"}
                    onChange={handleInputChange}
                  />
                  1 Year
                </label>
                <label>
                  <input
                    type="radio"
                    name="plan"
                    value="2-years"
                    checked={membershipForm.plan === "2-years"}
                    onChange={handleInputChange}
                  />
                  2 Years
                </label>
              </div>
            </div>

            <div>
              <label>Remove Membership?</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="membershipRemove"
                    value="no"
                    checked={membershipForm.membershipRemove === "no"}
                    onChange={handleInputChange}
                  />
                  No
                </label>
                <label>
                  <input
                    type="radio"
                    name="membershipRemove"
                    value="yes"
                    checked={membershipForm.membershipRemove === "yes"}
                    onChange={handleInputChange}
                  />
                  Yes
                </label>
              </div>
            </div>

            <button type="submit" style={{ marginTop: "10px" }}>
              {membershipForm.membershipRemove === "yes" ? "Delete" : "Update"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateMembership;
