const express = require("express");
var cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

app.use(cors());

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/travellerprofile", require("./routes/api/travellerProfile"));
// app.use('/api/agentprofile', require('./routes/api/agentProfile'));
app.use("/api/posts", require("./routes/api/posts"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
