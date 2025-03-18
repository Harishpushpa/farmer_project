import React, { useState, useEffect } from "react";
import "../css/middleman.css";
import { useNavigate } from "react-router-dom"; 

const Middleman = () => {
  const navigate = useNavigate();
  const [middlemen, setMiddlemen] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [primarySort, setPrimarySort] = useState("date");
  const [reviewCart, setReviewCart] = useState([]);
  const [selectedMiddleman, setSelectedMiddleman] = useState(null); // Track clicked card
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  
  // State for user info
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    // Retrieve user info from localStorage
    const storedData = JSON.parse(localStorage.getItem("logindata"));
    if (storedData) {
      setUserInfo({
        username: storedData.username,
        email: storedData.email,
        role: storedData.role,
      });
    }

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/middlemen");
        const data = await response.json();
        setMiddlemen(data);
        setSortedData(data);
      } catch (error) {
        console.error("Error fetching middlemen:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let sorted = [...middlemen];
    sorted.sort((a, b) => compare(a, b, primarySort));
    setSortedData(sorted);
  }, [primarySort, middlemen]);

  const compare = (a, b, type) => {
    switch (type) {
      case "price":
        return a.priceOffered - b.priceOffered;
      case "pincode":
        return a.pincode.localeCompare(b.pincode);
      case "cropType":
        return a.cropType.localeCompare(b.cropType);
      case "date":
        return new Date(b.datePublished) - new Date(a.datePublished);
      default:
        return 0;
    }
  };

  const addToReview = (middleman) => {
    setReviewCart((prevCart) => [...prevCart, middleman]);
  };

  // Handle the search functionality
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter middlemen data based on the search query (case insensitive)
    const filteredData = middlemen.filter((middleman) =>
      middleman.name.toLowerCase().includes(query.toLowerCase()) ||
      middleman.pincode.includes(query) ||
      middleman.cropType.toLowerCase().includes(query.toLowerCase())
    );

    // Update sortedData with filtered results
    setSortedData(filteredData);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>farmer Place</h2>
        <p>{userInfo.username} ({userInfo.email}) - {userInfo.role}</p> {/* Display user info */}
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
        <button className="add-product" onClick={() => navigate("/farmer/newproduct")}>Add Product</button>
      </aside>
      <main className="content">
        <div className="header">
          <h1>Middleman Listings</h1>
          <div className="sort-container">
            <select className="sort-dropdown" onChange={(e) => setPrimarySort(e.target.value)}>
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="pincode">Sort by Pincode</option>
              <option value="cropType">Sort by Crop Type</option>
            </select>
          </div>
          {/* Search input */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name, pincode, or crop type..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="middleman-list">
          {sortedData.map((middleman) => (
            <div 
              key={middleman._id} 
              className="middleman-card"
              onClick={() => setSelectedMiddleman(middleman)} // Open big card on click
            >
              <img src={middleman.photo} alt={middleman.name} className="middleman-photo" />
              <div className="middleman-info">
                <h3 className="middleman-name">{middleman.name}</h3>
                <p><strong>Phone:</strong> {middleman.phone}</p>
                <p><strong>Address:</strong> {middleman.address}</p>
                <p><strong>Pincode:</strong> {middleman.pincode}</p>
                <p><strong>Crop Needed:</strong> {middleman.cropType}</p>
                <p><strong>Price Offered:</strong> ₹{middleman.priceOffered}</p>
                <p><strong>Quality Needed:</strong> {middleman.qualityNeeded}</p>
                <p><strong>Date:</strong> {new Date(middleman.datePublished).toLocaleDateString()}</p>
                <button className="add-to-review" onClick={(e) => { e.stopPropagation(); addToReview(middleman); }}>Add to Review</button>
              </div>
            </div>
          ))}
        </div>

        {/* Big Card Popup (Appears on Click) */}
        {selectedMiddleman && (
          <div className="big-card">
            <div className="big-card-content">
              <button className="close-btn" onClick={() => setSelectedMiddleman(null)}>✖</button>
              <img src={selectedMiddleman.photo} alt={selectedMiddleman.name} className="big-photo" />
              <h2>{selectedMiddleman.name}</h2>
              <p><strong>Phone:</strong> {selectedMiddleman.phone}</p>
              <p><strong>Address:</strong> {selectedMiddleman.address}</p>
              <p><strong>Pincode:</strong> {selectedMiddleman.pincode}</p>
              <p><strong>Crop Needed:</strong> {selectedMiddleman.cropType}</p>
              <p><strong>Price Offered:</strong> ₹{selectedMiddleman.priceOffered}</p>
              <p><strong>Quality Needed:</strong> {selectedMiddleman.qualityNeeded}</p>
              <p><strong>Date:</strong> {new Date(selectedMiddleman.datePublished).toLocaleDateString()}</p>
              <button className="add-to-review" onClick={() => addToReview(selectedMiddleman)}>Add to Review</button>
            </div>
          </div>
        )}

        <div className="review-section">
          <h2>Review Cart</h2>
          {reviewCart.length > 0 ? (
            <ul className="review-list">
              {reviewCart.map((item, index) => (
                <li key={`${item._id}-${index}`} className="review-item">
                  {item.name} - {item.cropType} - ₹{item.priceOffered}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-review">No items in the review cart.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Middleman;
