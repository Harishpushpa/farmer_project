import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const FarmerProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    cropType: "",
    quantityAvailable: "",
    expectedPrice: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();  // Initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for phone and pincode fields
    if (name === "phone" && !/^\d*$/.test(value)) return; // Allow only digits
    if (name === "pincode" && value.length > 6) return; // Restrict to 6 digits

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/add-farmerproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Farmer product added successfully!");
        setFormData({
          name: "",
          phone: "",
          address: "",
          pincode: "",
          cropType: "",
          quantityAvailable: "",
          expectedPrice: "",
        });
      } else {
        setMessage(result.error || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2>Farmer Product Form</h2>
      {message && <p className="message" aria-live="polite">{message}</p>}
      <form onSubmit={handleSubmit} className="farmer-form">
        {[ 
          { label: "Name", name: "name", type: "text" },
          { label: "Phone", name: "phone", type: "text", maxLength: "10" },
          { label: "Address", name: "address", type: "text" },
          { label: "Pincode", name: "pincode", type: "text", maxLength: "6" },
          { label: "Crop Type", name: "cropType", type: "text" },
          { label: "Quantity Available", name: "quantityAvailable", type: "number" },
          { label: "Expected Price", name: "expectedPrice", type: "number" },
        ].map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}:</label>
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};
