const mongoose = require("mongoose");
require("dotenv").config();
const authRouter = require("./routes/authRoute");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  // Send a generic error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
