import React, { useState, useEffect } from "react";
import "../css/farmer.css";
import { useNavigate } from "react-router-dom";

const Farmers = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [selectedFarmer, setSelectedFarmer] = useState(null); // State to store selected farmer

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/farmer");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setFarmers(data);
        setFilteredFarmers(data);
      } catch (error) {
        console.error("Error fetching farmers:", error);
      }
    };
    fetchData();
  }, []);

  // Get user data from localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("logindata"));
    if (storedData) {
      setUserInfo({
        username: storedData.username,
        email: storedData.email,
        role: storedData.role,
      });
    }
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Filter farmers by pincode or cropType based on the search term
    const filtered = farmers.filter(
      (farmer) =>
        farmer.pincode.toLowerCase().includes(e.target.value.toLowerCase()) ||
        farmer.cropType.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredFarmers(filtered);
  };

  // Handle card click to open the modal
  const handleCardClick = (farmer) => {
    setSelectedFarmer(farmer);
  };

  // Close modal
  const closeModal = () => {
    setSelectedFarmer(null);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Middleman Place</h2>
        <button
  className="logout"
  onClick={() => {
    localStorage.removeItem("logindata");
    setUserInfo({ username: "", email: "", role: "" }); // Clear user info from state
    navigate("/"); // Navigate to the home page (or login page)
  }}
>
  Logout
</button>
        <button className="personaldata" onClick={() => navigate("/personaldata")}>Personal Data</button>
        <button className="add-product" onClick={() => navigate("/middleman/newproduct")}>Add Product</button>

        {/* Display user info from localStorage in the sidebar */}
        <div className="sidebar-content">
          <h3>User Information</h3>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Role:</strong> {userInfo.role}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content">
        <div className="header">
          <h1>Farmers Listings</h1>
          <div className="search-container">
            {/* Single search bar */}
            <input
              type="text"
              placeholder="Search by Pincode or Crop Type"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Display filtered farmers */}
        <div className="farmer-list">
          {filteredFarmers.length === 0 ? (
            <p>No farmers available matching the search term.</p>
          ) : (
            filteredFarmers.map((farmer) => (
              <div
                key={farmer._id}
                className="farmer-card"
                onClick={() => handleCardClick(farmer)} // Open the modal when the card is clicked
              >
                <img
                  src={farmer.photo}
                  alt={farmer.name}
                  className="farmer-photo"
                />
                <div className="farmer-info">
                  <h3 className="farmer-name">{farmer.name}</h3>
                  <p><strong>Phone:</strong> {farmer.phone}</p>
                  <p><strong>Address:</strong> {farmer.address}</p>
                  <p><strong>Pincode:</strong> {farmer.pincode}</p>
                  <p><strong>Crop:</strong> {farmer.cropType}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal for selected farmer */}
        {selectedFarmer && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-modal" onClick={closeModal}>X</button>
              <div className="modal-header">
                <h3>{selectedFarmer.name}</h3>
                <p>{selectedFarmer.cropType}</p>
              </div>
              <div className="modal-body">
                <img
                  src={selectedFarmer.photo}
                  alt={selectedFarmer.name}
                  className="modal-photo"
                />
                <p><strong>Phone:</strong> {selectedFarmer.phone}</p>
                <p><strong>Address:</strong> {selectedFarmer.address}</p>
                <p><strong>Pincode:</strong> {selectedFarmer.pincode}</p>
                <p><strong>Quantity Available:</strong> {selectedFarmer.quantityAvailable} kg</p>
                <p><strong>Expected Price:</strong> ₹{selectedFarmer.expectedPrice}</p>
                <p><strong>Date Published:</strong> {new Date(selectedFarmer.datePublished).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Farmers;
