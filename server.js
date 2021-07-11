const express = require("express");
var cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to \"tripaider api\"");
});

app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
