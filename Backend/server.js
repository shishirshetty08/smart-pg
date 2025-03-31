const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/smart-pg", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
connectDB();

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "owner"], default: "user" },
});
const User = mongoose.model("User", userSchema);

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: Object, required: true },
  locationString: { type: String, required: true },
  rent: { type: Number, required: true },
  facilities: [String],
  type: { type: String, required: true },
  description: { type: String, required: true },
  availableFrom: { type: Date, required: true },
  events: { type: String, default: "No" },
  amenities: [String],
  leaseTerm: { type: Number, default: 0 },
  ownerContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  images: [String],
  ownerEmail: { type: String, required: true },
});
const Listing = mongoose.model("Listing", listingSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, "your-secret-key", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

app.post("/api/auth/signup", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign({ email, role }, "your-secret-key", { expiresIn: "1h" });
    res.status(201).json({ user: email, role, token });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ email: user.email, role: user.role }, "your-secret-key", { expiresIn: "1h" });
    res.json({ user: user.email, role: user.role, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

app.post("/api/listings", authenticateToken, upload.array("images", 5), async (req, res) => {
  try {
    const {
      title, location, locationString, rent, facilities, type, description,
      availableFrom, events, amenities, leaseTerm, ownerContact,
    } = req.body;

    if (!title || !location || !locationString || !rent || !type || !description || !availableFrom || !ownerContact) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let parsedLocation, parsedFacilities, parsedAmenities, parsedOwnerContact;
    try {
      parsedLocation = location ? JSON.parse(location) : {};
      parsedFacilities = facilities ? JSON.parse(facilities) : [];
      parsedAmenities = amenities ? JSON.parse(amenities) : [];
      parsedOwnerContact = ownerContact ? JSON.parse(ownerContact) : {};
    } catch (parseError) {
      return res.status(400).json({ message: "Invalid JSON format in fields", error: parseError.message });
    }

    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    const listing = new Listing({
      title,
      location: parsedLocation,
      locationString,
      rent: Number(rent) || 0,
      facilities: parsedFacilities,
      type,
      description,
      availableFrom,
      events: events || "No",
      amenities: parsedAmenities,
      leaseTerm: Number(leaseTerm) || 0,
      ownerContact: parsedOwnerContact,
      images,
      ownerEmail: req.user.email,
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    console.error("Backend error creating listing:", error);
    res.status(500).json({ message: "Error creating listing", error: error.message });
  }
});

app.get("/api/listings", authenticateToken, async (req, res) => {
  try {
    const listings = await Listing.find({ ownerEmail: req.user.email });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listings", error: error.message });
  }
});

app.get("/api/listings/:id", authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    // Optionally restrict to owner only; remove this check if all users should see details
    if (listing.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized to view this listing" });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listing", error: error.message });
  }
});

app.delete("/api/listings/:id", authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(400).json({ message: "Listing not found" });
    if (listing.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized to delete this listing" });
    }
    await Listing.deleteOne({ _id: req.params.id });
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting listing", error: error.message });
  }
});

app.put("/api/listings/:id", authenticateToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.ownerEmail !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized to update this listing" });
    }

    const updatedData = {
      ...req.body,
      rent: req.body.rent ? Number(req.body.rent) : listing.rent,
      leaseTerm: req.body.leaseTerm ? Number(req.body.leaseTerm) : listing.leaseTerm,
      location: req.body.location ? JSON.parse(req.body.location) : listing.location,
      facilities: req.body.facilities ? JSON.parse(req.body.facilities) : listing.facilities,
      amenities: req.body.amenities ? JSON.parse(req.body.amenities) : listing.amenities,
      ownerContact: req.body.ownerContact ? JSON.parse(req.body.ownerContact) : listing.ownerContact,
    };

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });
    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: "Error updating listing", error: error.message });
  }
});

app.get("/", (req, res) => res.send("API running"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));