ECHO is on.
// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection setup
mongoose.connect("mongodb://localhost:27017/jobTracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Error connecting to MongoDB:", err));

// Job Application Schema
const jobApplicationSchema = new mongoose.Schema({
  company: String,
  position: String,
  status: { 
    type: String, 
    enum: ['Applied', 'Interviewing', 'Offer', 'Rejected'], 
    default: 'Applied' 
  },
  appliedDate: { type: Date, default: Date.now },
});

// Job Application Model
const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

// Routes

// Get all job applications
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await JobApplication.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new job application
app.post("/api/applications", async (req, res) => {
  const { company, position, status } = req.body;

  const newApplication = new JobApplication({
    company,
    position,
    status,
  });

  try {
    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
