const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const Port = 8000;

app.use(express.json());
app.use(cors());

// Database connection
require("./db/connections");

// Import the user model
const User = require("./Models/users"); 
const Middleman = require("./Models/Middleman");
const Farmer = require("./Models/Farmer");

// Route to register a user
// Registration Endpoint
app.post("/", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate fields
    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure valid role selection
    if (role !== "Farmer" && role !== "Middleman") {
      return res.status(400).json({ error: "Invalid role selected" });
    }

    const existinguser = await User.findOne({ email });

    if (existinguser) {
      console.log(`Attempted registration with existing email: ${email}`);
      res.status(400).json({ message: "The email already exists" });
    }

    // Save user to database
    const newUser = new User({ email, password, role });
    const result = await newUser.save();
    console.log(`New user registered: ${email} with role ${role}`);
    res.status(201).json({ message: "User registered successfully", user: result });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Error saving user" });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate fields
    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find the user by email
    const logindata = await User.findOne({ email });

    // Check if user exists
    if (!logindata) {
      console.log(`Login attempt failed for non-existing email: ${email}`);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check user credentials
    const user = await User.findOne({ email, password, role });
    if (!user) {
      console.log(`Login failed for email: ${email} with incorrect password or role`);
      return res.status(401).json({ error: "Invalid email, password, or role" });
    }

    console.log(`User logged in: ${email} with role ${role}`);
    // Send a single response
    res.status(200).json({
      message: "Login successful",
      user: { name: logindata.name, email: logindata.email, role: logindata.role },
      logindata
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Error logging in" });
  }
});

// Fetch all middlemen
app.get("/middlemen", async (req, res) => {
  try {
    const middlemen = await Middleman.find();
    console.log("Fetched middlemen data");
    res.status(200).json(middlemen);
  } catch (err) {
    console.error("Error fetching middlemen:", err);
    res.status(500).json({ error: "Failed to fetch middlemen data" });
  }
});

// Fetch all farmers
app.get('/farmer', async (req, res) => {
  try {
    const farmers = await Farmer.find();
    console.log("Fetched farmers data");
    res.status(200).json(farmers);
  } catch (error) {
    console.error("Error fetching farmers:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update personal data
app.put("/personaldata", async (req, res) => {
  const { email, name, dob, phone, address, cardNumber, pincode, areaOwned } = req.body;

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { name, dob, phone, address, cardNumber, pincode, areaOwned },
    { new: true }
  );

  if (updatedUser) {
    console.log(`User data updated for email: ${email}`);
    res.json(updatedUser);
  } else {
    console.log(`User not found for email: ${email}`);
    res.status(404).json({ message: "User not found" });
  }
});

// Route for farmers to add available products
app.post("/add-farmerproduct", async (req, res) => {
  try {
    const { name, phone, address, pincode, cropType, quantityAvailable, expectedPrice } = req.body;

    // Validate required fields
    if (!name || !phone || !address || !pincode || !cropType || !quantityAvailable || !expectedPrice) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newProduct = new Farmer({
      name,
      phone,
      address,
      pincode,
      cropType,
      quantityAvailable,
      expectedPrice,
    });

    await newProduct.save();
    console.log(`New farmer product added: ${name} - ${cropType}`);
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new middleman product
app.post("/add-middlemanproduct", async (req, res) => {
  const {
    name,
    phone,
    address,
    pincode,
    cropType,
    priceOffered,
    qualityNeeded,
  } = req.body;

  try {
    const newMiddlemanProduct = new Middleman({
      name,
      phone,
      address,
      pincode,
      cropType,
      priceOffered,
      qualityNeeded,
    });

    await newMiddlemanProduct.save();
    console.log(`New middleman product added: ${name} - ${cropType} with price ₹${priceOffered}`);
    res.status(200).json({
      message: "Middleman product added successfully!",
      newMiddlemanProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product. Please try again." });
  }
});

// Start server
app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
