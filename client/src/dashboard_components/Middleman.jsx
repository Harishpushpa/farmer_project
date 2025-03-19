import React, { useState, useEffect } from "react";
import "../css/middleman.css";
import { useNavigate } from "react-router-dom";

const Middleman = () => {
  const navigate = useNavigate();
  const [middlemen, setMiddlemen] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [primarySort, setPrimarySort] = useState("date");
  const [reviewCart, setReviewCart] = useState([]);
  const [selectedMiddleman, setSelectedMiddleman] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    role: "",
  });

  useEffect(() => {
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

  const cropPrices = [
    { name: "Wheat", minPrice: 1500, maxPrice: 2000 },
    { name: "Rice", minPrice: 1800, maxPrice: 2500 },
    { name: "Cotton", minPrice: 4000, maxPrice: 5500 },
    { name: "Millets", minPrice: 1200, maxPrice: 1800 },
  ];

  const addToReview = (middleman) => {
    setReviewCart((prevCart) => {
      if (!prevCart.some((item) => item._id === middleman._id)) {
        return [...prevCart, middleman];
      }
      return prevCart;
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setSearchQuery(query);

    const filteredData = middlemen.filter(
      (middleman) =>
        middleman.name.toLowerCase().includes(query) ||
        middleman.pincode.includes(query) ||
        middleman.cropType.toLowerCase().includes(query)
    );

    setSortedData(filteredData);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString();
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Farmer Place</h2>
        <p>
          {userInfo.username} ({userInfo.email}) - {userInfo.role}
        </p>
        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem("logindata");
            setUserInfo({ username: "", email: "", role: "" });
            navigate("/login");
          }}
        >
          Logout
        </button>
        <button className="personaldata" onClick={() => navigate("/personaldata")}>
          Personal Data
        </button>
        <button className="add-product" onClick={() => navigate("/farmer/newproduct")}>
          Add Product
        </button>
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
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name, pincode, or crop type..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="marquee-container">
          <marquee className="marquee">
            <span className="marquee-title">📢 Tamil Nadu Crop Prices ({getCurrentDate()}): </span>
            {cropPrices.map((crop, index) => (
              <span key={index} className="marquee-item">
                {crop.name}: ₹{crop.minPrice} - ₹{crop.maxPrice} &nbsp;|&nbsp;
              </span>
            ))}
          </marquee>
        </div>

        <div className="middleman-list">
          {sortedData.map((middleman) => (
            <div
              key={middleman._id}
              className="middleman-card"
              onClick={() => setSelectedMiddleman(middleman)}
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
                <button className="add-to-review" onClick={(e) => { e.stopPropagation(); addToReview(middleman); }}>
                  Add to Review
                </button>
              </div>
            </div>
          ))}
        </div>

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
      </main>
    </div>
  );
};

export default Middleman;
