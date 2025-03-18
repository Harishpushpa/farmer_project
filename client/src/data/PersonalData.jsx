import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Personaldata = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    dob: "",
    phone: "",
    address: "",
    cardNumber: "",
    pincode: "",
    areaOwned: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("logindata");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
      setFormData(parsedData);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatDateToDMY = (date) => {
      if (!date) return null;
      const d = new Date(date);
      return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    };

    const updatedData = {
      email: formData.email,
      role: formData.role,
      name: formData.name,
      dob: formatDateToDMY(formData.dob),
      phone: formData.phone,
      address: formData.address || "Not Provided",
      cardNumber: formData.cardNumber || "Not Provided",
      pincode: formData.pincode || "Not Provided",
      areaOwned: formData.areaOwned || "Not Provided",
    };

    try {
      const response = await fetch("http://localhost:8000/personaldata", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("logindata", JSON.stringify(result));
        setUserData(result);
        setIsEditing(false);
      } else {
        console.error("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (!userData || isEditing) {
    return (
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 mt-10 border">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {userData ? "Edit Your Details" : "Enter Your Details"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <label className="block">Email (Not Editable)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            readOnly
          />

          <label className="block">Role (Not Editable)</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            readOnly
          />

          <label className="block">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <label className="block">Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <label className="block">Address</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <label className="block">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <label className="block">Pincode</label>
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <label className="block">Area of Land Owned</label>
          <input
            type="text"
            name="areaOwned"
            placeholder="Area of Land Owned"
            value={formData.areaOwned}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-4">
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
              {userData ? "Update Data" : "Save Data"}
            </button>
            {userData && (
              <button
                type="button"
                className="w-full bg-gray-400 text-white p-2 rounded"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 mt-10 border">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Personal Information</h2>
      <div className="mt-4 space-y-2">
        <p>
          <span className="font-semibold">Name:</span> {userData.name || "Not Provided"}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {userData.email}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {userData.role}
        </p>
        <p>
          <span className="font-semibold">Date of Birth:</span> {userData.dob || "Not Provided"}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {userData.phone || "Not Provided"}
        </p>
        <p>
          <span className="font-semibold">Address:</span> {userData.address || "Not Provided"}
        </p>
        <p>
          <span className="font-semibold">Card Number:</span> {userData.cardNumber || "Not Provided"}
        </p>
        <p>
          <span className="font-semibold">Pincode:</span> {userData.pincode || "Not Provided"}
        </p>
        <p>
          <span className="font-semibold">Area of Land Owned:</span> {userData.areaOwned || "Not Provided"}
        </p>
      </div>
      <button className="w-full bg-green-500 text-white p-2 rounded mt-4" onClick={() => setIsEditing(true)}>
        Edit Details
      </button>

      {/* Add the Go Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous route
        className="w-full bg-red-500 text-white p-2 rounded mt-4"
      >
        Go Back
      </button>
    </div>
  );
};
