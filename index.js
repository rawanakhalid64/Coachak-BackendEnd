<<<<<<< HEAD
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Import routes
const authRouter = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const allergyRoute = require('./routes/allergyRoute');
const healthConditionRoute = require('./routes/healthConditionRoute');
const certificateRoute = require('./routes/certificateRoute');
const planRoute = require('./routes/planRoute');
const trainigPlanRoute = require('./routes/trainigPlanRoute');
const subscriptionRoute = require('./routes/subscriptionRoute');
const nutritionPlanRoute = require('./routes/nutritionPlanRoute');
const dayPlanRoute = require('./routes/dayPlanRoute');
const foodRoute = require('./routes/foodRoute');
const ingredientRoute = require('./routes/ingredientRoute');
const mealRoute = require('./routes/mealRoute');
const workoutRoute = require('./routes/workoutRoute');
const exerciseRoute = require('./routes/exerciseRoute');
const ratingRoute = require('./routes/ratingRoute');
const programRoute = require('./routes/programRoute');
const upload = require('./middlewares/multer');
const cloudinary = require('./utils/cloudinary');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
=======
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors"); // Import CORS package
const authRouter = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const trainerRoute = require("./routes/trainerRoute");
const allergyRoute = require("./routes/allergyRoute");
const healthConditionRoute = require("./routes/healthConditionRoute");
const certificateRoute = require("./routes/certificateRoute");
const planRoute = require("./routes/planRoute");
const trainigPlanRoute = require("./routes/trainigPlanRoute");
const subscriptionRoute = require("./routes/subscriptionRoute");
const nutritionPlanRoute = require("./routes/nutritionPlanRoute");
const dayPlanRoute = require("./routes/dayPlanRoute");
const weekPlanRoute = require("./routes/weekPlanRoute");
const foodRoute = require("./routes/foodRoute");
const ingredientRoute = require("./routes/ingredientRoute");
const mealRoute = require("./routes/mealRoute");
const workoutRoute = require("./routes/workoutRoute");
const exerciseRoute = require("./routes/exerciseRoute");
const express = require("express");
const bodyParser = require("body-parser");
const upload = require("./middlewares/multer");
const cloudinary = require("./utils/cloudinary");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDb();
>>>>>>> forMerging

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

<<<<<<< HEAD
// Only connect to the database if this file is run directly (not when required as a module)
if (require.main === module) {
  // Connect to MongoDB
  connectDB().catch(error => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRoute);
=======
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/trainers", trainerRoute);
>>>>>>> forMerging
app.use("/api/v1/certificates", certificateRoute);
app.use("/api/v1/allergies", allergyRoute);
app.use("/api/v1/health-conditions", healthConditionRoute);
app.use("/api/v1/plans", planRoute);
app.use("/api/v1/subscriptions", subscriptionRoute);
app.use("/api/v1/training-plans", trainigPlanRoute);
app.use("/api/v1/nutrition-plans", nutritionPlanRoute);
app.use("/api/v1/day-plans", dayPlanRoute);
<<<<<<< HEAD
=======
// app.use("/api/v1/day-names", dayNameRoute);
>>>>>>> forMerging
app.use("/api/v1/foods", foodRoute);
app.use("/api/v1/ingredients", ingredientRoute);
app.use("/api/v1/meals", mealRoute);
app.use("/api/v1/workouts", workoutRoute);
app.use("/api/v1/exercises", exerciseRoute);
<<<<<<< HEAD
app.use("/api/v1/ratings", ratingRoute);
app.use("/api/v1/programs", programRoute);
=======
app.use("/api/v1/weeks", weekPlanRoute);
>>>>>>> forMerging

// upload image
app.use("/api/v1/upload", upload.single("file"), function (req, res) {
  if (!req.file) {
    console.log(req);
    return res.status(404).json({ message: "No image founded" });
  }
  cloudinary.uploader.upload(req.file.path, function functionName(err, result) {
    if (err) {
      console.log(err);
      return res.statusCode(500).json({
        success: false,
        message: "Cannot upload Image, check the image name",
      });
    }
    console.log(result);
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: result.url,
    });
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  // Send a generic error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.get("/", (req, res) => {
  res.send("welcome to coachak");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
