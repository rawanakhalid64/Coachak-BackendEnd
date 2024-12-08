const mongoose = require("mongoose");
require("dotenv").config();
const authRouter = require("./routes/authRoute");
<<<<<<< HEAD
const userRoute = require("./routes/userRoute");
const allergyRoute = require("./routes/allergyRoute");
const healthConditionRoute = require("./routes/healthConditionRoute");
const certificateRoute = require("./routes/certificateRoute");
const express = require("express");
const bodyParser = require("body-parser");

=======
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
>>>>>>> 87c89363440156aea40690d4230ba6dc9a91463e
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
<<<<<<< HEAD

=======
app.use(cors());
>>>>>>> 87c89363440156aea40690d4230ba6dc9a91463e
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
<<<<<<< HEAD
app.use("/api/v1/users", userRoute);
app.use("/api/v1/certificates", certificateRoute);
app.use("/api/v1/allergies", allergyRoute);
app.use("/api/v1/health-conditions", healthConditionRoute);
=======
>>>>>>> 87c89363440156aea40690d4230ba6dc9a91463e

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  // Send a generic error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

<<<<<<< HEAD
app.get("/", (req, res) => {
  res.send("welcome to coachak");
});
const PORT = process.env.PORT || 3000;
=======
const PORT = process.env.PORT || 3001;
>>>>>>> 87c89363440156aea40690d4230ba6dc9a91463e
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
